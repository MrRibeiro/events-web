import ContentPage from "@/components/ContentPage";
import { newEvent } from "@/services/events";
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
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";

interface EventForm {
  name: string;
  description: string;
  date: Date;
  initHour: string;
  endHour: string;
}

export default function Create() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Nome do evento é obrigatório"),
    description: Yup.string().required("Descrição do evento é obrigatória"),
    date: Yup.date()
      .min(new Date(), "A data não pode ser anterior a data de hoje")
      .required("Data do evento é obrigatória"),
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
    formState: { errors },
  } = useForm<EventForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<EventForm> = (data) => {
    setIsLoading(true);
    setSuccess("");
    setError("");

    const payload: Events = {
      name: data.name,
      description: data.description,
      date: new Date(data.date),
      initHour: data.initHour,
      endHour: data.endHour,
    };

    newEvent(payload)
      .then((response) => {
        setSuccess(`${response.message} Id: ${response.data.id}`);
        reset();
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ContentPage title={"Criar evento"} breadcrumbs={"Criar Evento"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <Alert severity="error">
            <AlertTitle>Ocorreu um erro </AlertTitle>
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
                    format="DD/MM/YYYY"
                    onChange={(date) => field.onChange(date)}
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
            "Cadastrar"
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
