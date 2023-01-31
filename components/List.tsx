import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';

export const List = (props: { arr: any[] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <div style={{ margin: '0.5rem', marginBottom: '-1rem' }}>
      <TableContainer component={Paper} ref={inputRef}>
        <Table
          sx={{ minWidth: 650 }}
          stickyHeader
          size="small"
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              {Object.keys(Object.assign({}, ...props.arr)).map((val, id) => (
                <TableCell key={id} align="center" ref={inputRef}>
                  {val.toString().charAt(0).toUpperCase() + val.slice(1)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.arr
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, idx) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={idx}>
                    <TableCell component="th" scope="row" ref={inputRef}>
                      {page * 10 + idx + 1}
                    </TableCell>
                    {Object.values(item).map((val: any, id) => {
                      return (
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
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={props.arr.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};
