import ContentPage from "@/components/ContentPage";
import DialogStyled from "@/components/Dialog";
import { deleteEvent, fetchEventsData } from "@/services/events";
import { Events } from "@/types/events";
import { Delete, Edit, Event } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Backdrop,
  Button,
  CircularProgress,
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
import { StyledTableCell, StyledTableRow } from "./styles";

interface HomeProps {
  events: Events[];
}

const DISCOVERY_DOC = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/calendar";

export default function Home({ events }: HomeProps) {
  const [eventsData, setEventsData] = useState<Events[]>([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [openConfirmMarkEvent, setOpenConfirmMarkEvent] =
    useState<boolean>(false);
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

  const formatDateTime = (date: Date, hour: string) => {
    const newDate = new Date(date);
    const myHour = hour.split(":");

    newDate.setHours(Number(myHour[0]));
    newDate.setMinutes(Number(myHour[1]));

    console.log(newDate.getTimezoneOffset());

    return newDate;
  };

  const handleConfirmMarkEvent = async () => {
    const gapi = await import("gapi-script").then((pack) => pack.gapi);

    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey: String(process.env.NEXT_PUBLIC_API_KEY),
        clientId: String(process.env.NEXT_PUBLIC_CLIENT_ID),
        discoveryDocs: DISCOVERY_DOC,
        scope: SCOPES,
      });

      gapi.client.load("calendar", "v3", () => console.log("loaded!"));

      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          var event = {
            summary: rowEvent.name,
            description: rowEvent.description,
            start: {
              dateTime: formatDateTime(rowEvent.date!, rowEvent.initHour!),
              timeZone: "America/Fortaleza",
            },
            end: {
              dateTime: formatDateTime(rowEvent.date!, rowEvent.endHour!),
              timeZone: "America/Fortaleza",
            },
            recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
          };

          let request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });

          request.execute(() => {
            console.log(event);
            setOpenConfirmMarkEvent(false);
          });
        });
    });
  };

  const handleClickOpenDelete = (row: Events) => {
    setRowEvent(row);
    setOpenConfirmDelete(true);
  };

  const handleClickOpenMark = (row: Events) => {
    setRowEvent(row);
    setOpenConfirmMarkEvent(true);
  };

  const handleCloseDelete = () => {
    setRowEvent({});
    setOpenConfirmDelete(false);
  };

  const handleCloseMark = () => {
    setRowEvent({});
    setOpenConfirmMarkEvent(false);
  };

  const handleSyncEvents = async () => {
    let eventsData = await fetchEventsData();
    setEventsData(eventsData);
  };

  const handleConfirmDelete = () => {
    setIsLoading(true);
    setSuccess("");
    setError("");
    deleteEvent(rowEvent.id!)
      .then((response) => {
        handleSyncEvents();
        setSuccess(response.message);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setOpenConfirmDelete(false);
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
                <StyledTableCell>
                  <Button
                    variant="contained"
                    sx={{ marginRight: "8px" }}
                    color="secondary"
                    href={`/events/${row.id}`}
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleClickOpenDelete(row)}
                  >
                    <Delete />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleClickOpenMark(row)}
                  >
                    <Event />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogStyled
        key={"delete"}
        title={`Deletar ${rowEvent.name}`}
        contentText={`Deseja realmente deletar ${rowEvent.name}`}
        open={openConfirmDelete}
        handleClose={handleCloseDelete}
        handleConfirm={handleConfirmDelete}
      />

      <DialogStyled
        key={"mark"}
        title={`Marcar evento ${rowEvent.name} na agenda!`}
        contentText={`Deseja marcar o evento ${rowEvent.name} na sua agenda do google ?`}
        open={openConfirmMarkEvent}
        handleClose={handleCloseMark}
        handleConfirm={handleConfirmMarkEvent}
      />

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
