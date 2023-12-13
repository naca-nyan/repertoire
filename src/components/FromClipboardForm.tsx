import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Link,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { fromURL } from "./utils";
import { Song, setSong } from "../data/song";
import { Done } from "@mui/icons-material";

const importColumns = ["artist", "title", "url"] as const;
type ImportColumns = (typeof importColumns)[number];
const importColumnsText: Record<ImportColumns, string> = {
  artist: "アーティスト名",
  title: "曲名",
  url: "URL",
};

async function getHtmlFromClipboard(): Promise<string> {
  const clipboardItems = await navigator.clipboard.read();
  for (const item of clipboardItems) {
    if (item.types.includes("text/html")) {
      const blob = await item.getType("text/html");
      return await blob.text();
    }
  }
  throw Error("text/html not found from clipboard");
}

type Cell = { text: string; href?: string };

function parseRowsFromHtml(html: string): Cell[][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const table = doc.querySelector("table");
  if (!table) return [];
  return Array.from(table.rows).map((row) =>
    Array.from(row.cells).map((cell) => ({
      text: cell.textContent ?? "",
      href: cell.querySelector("a")?.href,
    }))
  );
}

const NONE = "";
const ImportTable: React.FC<{
  rows: Cell[][];
  error: string;
  onChangeColumns: (indexOf: Record<ImportColumns, number>) => void;
}> = ({ rows, error, onChangeColumns }) => {
  const colSize = rows[0]?.length ?? 0;
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => setSelected(Array(colSize).fill(NONE)), [rows, colSize]);
  const handleChangeSelect = (index: number, key: string) => {
    const newSelected = selected.map((k) => (k === key ? NONE : k));
    newSelected[index] = key;
    setSelected(newSelected);
    onChangeColumns(
      Object.fromEntries(
        importColumns.map((col) => [
          col,
          newSelected.findIndex((s) => s === col),
        ])
      ) as Record<ImportColumns, number>
    );
  };
  if (rows.length === 0) return <></>;
  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          {Array.from({ length: colSize }, (_, i) => (
            <TableCell key={i}>
              <FormControl fullWidth error={Boolean(error)}>
                <Select
                  fullWidth
                  value={selected[i] ?? NONE}
                  variant={"standard"}
                  disableUnderline
                  onChange={(e) => handleChangeSelect(i, e.target.value)}
                >
                  <MenuItem value={NONE}>未選択</MenuItem>
                  {importColumns.map((col) => (
                    <MenuItem key={col} value={col}>
                      {importColumnsText[col]}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{error}</FormHelperText>
              </FormControl>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {row.map((cell, j) => (
              <TableCell key={j}>
                {cell.href ? (
                  <Link href={cell.href}>{cell.text}</Link>
                ) : (
                  cell.text
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ImportingRow: React.FC<{
  userId: string;
  row: Cell[];
  indexOf: Record<ImportColumns, number>;
}> = ({ userId, row, indexOf }) => {
  const [state, setState] = useState("doing");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const { songId, key, symbol } = songIdFromCell(row[indexOf.url]);
      const artist = row[indexOf.artist].text;
      const title = row[indexOf.title].text;
      const song: Song = { artist, title };
      if (key) song.key = key;
      if (symbol) song.symbol = symbol;
      song.createdAt = Date.now();
      setSong(userId, songId, song).then(() => setState("done"));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setState("error");
    }
  }, [userId, row, indexOf]);

  return (
    <TableRow>
      {row.map((cell, j) => (
        <TableCell key={j}>
          {cell.href ? <Link href={cell.href}>{cell.text}</Link> : cell.text}
        </TableCell>
      ))}
      <TableCell>
        {state === "doing" && <CircularProgress size="24px" />}
        {state === "done" && <Done />}
        {state === "error" && <Typography color="error">{error}</Typography>}
      </TableCell>
    </TableRow>
  );
};

const ImportingTable: React.FC<{
  userId: string;
  rows: Cell[][];
  indexOf: Record<ImportColumns, number>;
}> = ({ userId, rows, indexOf }) => {
  const colSize = rows[0]?.length ?? 0;
  const selectedLabels = Array(colSize).fill("");
  importColumns.forEach(
    (k) => (selectedLabels[indexOf[k]] = importColumnsText[k])
  );
  if (rows.length === 0) return <></>;
  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          {Array.from({ length: colSize }, (_, i) => (
            <TableCell key={i}>{selectedLabels[i]}</TableCell>
          ))}
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, i) => (
          <ImportingRow userId={userId} row={row} indexOf={indexOf} key={i} />
        ))}
      </TableBody>
    </Table>
  );
};

function songIdFromCell(cell: Cell) {
  try {
    const url = new URL(cell.href ?? "");
    return fromURL(url);
  } catch {
    const url = new URL(cell.text);
    return fromURL(url);
  }
}

const defaultIndexOf = Object.fromEntries(
  importColumns.map((c) => [c, -1])
) as Record<ImportColumns, number>;

const FromClipboardForm: React.FC<{
  userId: string;
  open: boolean;
  onClose: () => void;
}> = ({ userId, open, onClose }) => {
  const [rows, setRows] = useState<Cell[][]>([]);
  const [phase, setPhase] = useState(1);
  const [indexOf, setIndexOf] =
    useState<Record<ImportColumns, number>>(defaultIndexOf);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setPhase(1);
    setError("");
    setIndexOf(defaultIndexOf);
    getHtmlFromClipboard()
      .then((html) => setRows(parseRowsFromHtml(html)))
      .catch(() => setRows([]));
  }, [open]);

  const onSubmit = () => {
    if (importColumns.some((k) => indexOf[k] < 0)) {
      setError("インポートする項目が足りません");
      return;
    }
    setPhase(2);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>クリップボードから追加</DialogTitle>
      <DialogContent>
        <Typography>
          {rows.length > 0
            ? "インポートする列を設定してください。未選択の列は無視されます。"
            : "曲データが見つかりませんでした"}
        </Typography>
        {phase === 1 && (
          <ImportTable
            rows={rows}
            error={error}
            onChangeColumns={(indexOf) => {
              setIndexOf(indexOf);
              setError("");
            }}
          />
        )}
        {phase === 2 && (
          <ImportingTable userId={userId} rows={rows} indexOf={indexOf} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
        {rows.length > 0 && phase === 1 && (
          <Button variant="contained" onClick={onSubmit} autoFocus>
            追加する
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FromClipboardForm;