import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { SongEntries } from "../data/song";
import { siteKind, toURL } from "./utils";
import SiteIcon from "./SiteIcon";
import { Link } from "@mui/material";

function SongCell(props: GridRenderCellParams) {
  if (typeof props.value !== "object") return null;
  const [songId, song] = props.value;
  const kind = siteKind(songId);
  const url = toURL(songId, song).href;
  return (
    <>
      <SiteIcon kind={kind} />
      <Link href={url}>{song.title}</Link>
    </>
  );
}

const columns: GridColDef[] = [
  { field: "artist", flex: 1, maxWidth: 300 },
  {
    field: "songEntry",
    flex: 1,
    renderCell: SongCell,
    sortComparator: ([, s1], [, s2]) => s1.title.localeCompare(s2.title),
  },
  { field: "key", flex: 1, maxWidth: 80 },
  { field: "symbol", flex: 1, maxWidth: 80 },
];

const SongDataGrid: React.FC<{ data: SongEntries }> = ({ data }) => {
  const songRows = data.map(([songId, song]) => ({
    id: songId,
    artist: song.artist,
    songEntry: [songId, song],
    key: song.key,
    symbol: song.symbol,
  }));
  return (
    <DataGrid
      columns={columns}
      rows={songRows}
      density="compact"
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },
        columns: { columnVisibilityModel: { key: false, symbol: false } },
      }}
      pageSizeOptions={[20, 50, 100]}
    />
  );
};

export default SongDataGrid;
