import ContentPage from "@/components/ContentPage";
import { deleteEvent, fetchEventsData } from "@/services/events";
import { Events } from "@/types";
import { Delete, Edit } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CancelButton, StyledTableCell, StyledTableRow } from "./styles";

interface HomeProps {
  events: Events[];
}

export default function Home({ events }: HomeProps) {
  const [eventsData, setEventsData] = useState<Events[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [rowEvent, setRowEvent] = useState<Events>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (events) {
      setEventsData(events);
    }
  }, [events]);

  if (eventsData.length === 0) return null;

  const handleClickOpen = (row: Events) => {
    setRowEvent(row);
    setOpen(true);
  };

  const handleClose = () => {
    setRowEvent({});
    setOpen(false);
  };

  const handleSyncEvents = async () => {
    let eventsData = await fetchEventsData();
    setEventsData(eventsData);
  };

  const handleConfirmDelete = (id: number) => {
    setIsLoading(true);
    setSuccess("");
    setError("");
    deleteEvent(id)
      .then((response) => {
        handleSyncEvents();
        setSuccess(response.message);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setOpen(false);
        setIsLoading(false);
      });
  };

  return (
    <ContentPage
      title={"Meus eventos"}
      action={
        <Link href="/events/create">
          <Button variant="contained" color="secondary">
            Criar evento
          </Button>
        </Link>
      }
    >
      {error && (
        <Alert severity="error">
          <AlertTitle>Ocorreu um erro</AlertTitle>
          <strong>{error}</strong>
        </Alert>
      )}

      {success && (
        <Alert severity="success">
          <AlertTitle>Sucesso</AlertTitle>
          <strong>{success}</strong>
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ marginTop: "8px" }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Nome</StyledTableCell>
              <StyledTableCell align="right">Descrição</StyledTableCell>
              <StyledTableCell align="right">Data</StyledTableCell>
              <StyledTableCell align="right">Inicio</StyledTableCell>
              <StyledTableCell align="right">Fim</StyledTableCell>
              <StyledTableCell align="right">Ações</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventsData.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.description}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {format(new Date(row.date!), "dd/MM/yyyy")}
                </StyledTableCell>
                <StyledTableCell align="right">{row.initHour}</StyledTableCell>
                <StyledTableCell align="right">{row.endHour}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    sx={{ marginRight: "20px" }}
                    color="secondary"
                    href={`/events/${row.id}`}
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleClickOpen(row)}
                  >
                    <Delete />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        fullWidth
        aria-describedby="alert-dialog-confirmation"
      >
        <DialogTitle>{`Deletar ${rowEvent.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-confirmation">
            {`Deseja realmente deletar ${rowEvent.name}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleClose}>Cancelar</CancelButton>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleConfirmDelete(rowEvent.id!)}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </ContentPage>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  let eventsData = await fetchEventsData();

  return { props: { events: eventsData } };
};
