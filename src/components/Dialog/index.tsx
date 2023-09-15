import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { CancelButton } from "./styles";

interface DialogProps {
  title: string;
  contentText: string;
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}
export default function DialogStyled({
  open,
  title,
  contentText,
  handleClose,
  handleConfirm,
}: DialogProps) {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      fullWidth
      aria-describedby="alert-dialog-confirmation"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-confirmation">
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={handleClose}>Cancelar</CancelButton>
        <Button variant="contained" color="error" onClick={handleConfirm}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
