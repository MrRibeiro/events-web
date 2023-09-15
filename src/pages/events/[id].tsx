import ContentPage from "@/components/ContentPage";
import { fetchEventData, updateEvent } from "@/services/events";
import { Events } from "@/types/events";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  AlertTitle,
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

interface CreateProps {
  event: Events;
}

interface EventEditForm {
  name: string;
  description: string;
  date: Date;
  initHour: string;
  endHour: string;
}

export default function Create({ event }: CreateProps) {
  const [eventData, setEventData] = useState<Events>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nome do evento é obrigatório"),
    description: Yup.string().required("Descrição do evento é obrigatória"),
    date: Yup.date().required("Data do evento é obrigatória"),
    initHour: Yup.string()
      .matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida.")
      .required("Hora inicial é obrigatória"),
    endHour: Yup.string()
      .matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida.")
      .required("Hora final é obrigatória"),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EventEditForm>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (event) {
      setEventData(event);
    }
  }, [event]);

  useEffect(() => {
    if (eventData) {
      console.log(eventData.name);
      setValue("name", eventData.name!);
      setValue("description", eventData.description!);
      setValue("initHour", eventData.initHour!);
      setValue("endHour", eventData.endHour!);
      setValue("date", eventData.date!);
    }
  }, [eventData, setValue]);

  if (!eventData) return null;

  const onSubmit: SubmitHandler<EventEditForm> = (data) => {
    setIsLoading(true);
    setSuccess("");
    setError("");

    const payload: Events = {
      id: eventData.id,
      name: data.name,
      description: data.description,
      date: new Date(data.date),
      initHour: data.initHour,
      endHour: data.endHour,
    };

    console.log("EDIT: ", payload);

    updateEvent(payload)
      .then((response) => {
        setSuccess(`${response.message} Id: ${response.data.id}`);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <ContentPage
      title={`Editar ${eventData.name}`}
      breadcrumbs={"Editar Evento"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <Grid
          container
          spacing={2}
          sx={{ marginTop: "12px", marginBottom: "16px" }}
        >
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                id="name"
                label="Nome"
                variant="filled"
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                {...register("name")}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                id="description"
                label="Descrição"
                variant="filled"
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
                {...register("description")}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    format="DD/MM/YYYY"
                    onChange={(date) => field.onChange(date)}
                    value={dayjs(field.value)}
                  />
                )}
              />
              <div>{errors.date?.message}</div>
            </FormControl>
          </Grid>
          <Grid item xs>
            <FormControl fullWidth>
              <TextField
                required
                id="initHour"
                label="Hora Inicial"
                variant="filled"
                placeholder="hh:mm"
                error={Boolean(errors.initHour)}
                helperText={errors.initHour?.message}
                {...register("initHour")}
              />
            </FormControl>
          </Grid>
          <Grid item xs>
            <FormControl fullWidth>
              <TextField
                required
                id="endHour"
                label="Hora Final"
                variant="filled"
                placeholder="hh:mm"
                error={Boolean(errors.endHour)}
                helperText={errors.endHour?.message}
                {...register("endHour")}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" color="secondary">
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Atualizar"
          )}
        </Button>
      </form>

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  var id = context.query["id"];
  let eventData = await fetchEventData(String(id));

  console.log("DATA event ", eventData);

  return { props: { event: eventData } };
};
