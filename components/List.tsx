import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export const List = (props: { arr: any[] }) => {
  return (
    <div style={{ margin: '0.5rem' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              {Object.keys(Object.assign({}, ...props.arr)).map((val, id) => (
                <TableCell key={id} align="center">
                  {val.toString().charAt(0).toUpperCase() + val.slice(1)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.arr?.map((item, idx) => (
              <TableRow
                key={idx}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {idx + 1}
                </TableCell>
                {Object.values(item).map((val: any, id) => (
                  <TableCell
                    key={id}
                    sx={{
                      maxWidth: 30,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    align="center"
                  >
                    {val?.toString()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
