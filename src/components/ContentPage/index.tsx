import { NavigateNext } from "@mui/icons-material";
import {
  Breadcrumbs,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { CardStyled } from "./styles";

type ContentPageProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  breadcrumbs?: string;
};

const ContentPage = ({
  children,
  title,
  breadcrumbs,
  action,
}: ContentPageProps) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
        <Link underline="hover" color="secundary" href="/">
          Home
        </Link>
        {breadcrumbs && (
          <Typography color="text.primary">{breadcrumbs}</Typography>
        )}
      </Breadcrumbs>

      <CardStyled>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom variant="h5" component="h2">
                {title}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{ textAlign: "right" }}>
              {action}
            </Grid>
          </Grid>

          {children}
        </CardContent>
      </CardStyled>
    </Grid>
  );
};

export default ContentPage;
