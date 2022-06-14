import React, { useState } from "react";
import { Add } from "@mui/icons-material";
import { Fab, Fade, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SongSubmitForm: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab
        onClick={() => setOpen(true)}
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <Add />
      </Fab>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Fade in={open}>
          <Box sx={style}>
            <Typography>TODO: Register new song</Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default SongSubmitForm;
