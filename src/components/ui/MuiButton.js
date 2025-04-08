import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function BasicButtons({ onClickHandler, variant , content}) {
  return (
    <Stack spacing={2} direction="row">
      {variant === "text" && (
        <Button variant="text" onClick={onClickHandler}>
          {content}
        </Button>
      )}
      {variant === "contained" && (
        <Button variant="contained" onClick={onClickHandler}>
          {content}
        </Button>
      )}
      {variant === "outlined" && (
        <Button variant="outlined" onClick={onClickHandler}>
          {content}
        </Button>
      )}
    </Stack>
  );
}
