import { Button, Typography } from '@mui/material';
import { ChangeEvent, FC, useContext, useRef, useState } from 'react';
import { ResultContext } from './ka-ching/cash-register/CreateCashBox';

export const CSVInput: FC = () => {
  const { setFile, setShowImportBtn, resetValues } = useContext(ResultContext);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [show, setShow] = useState(false);

  const handleUploadClick = () => {
    resetValues();
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) {
        return;
      }
      const fileName = e.target.files[0].name;
      const startsWith = fileName.startsWith('cb_');
      if (startsWith) {
        setShow(true);
        setShowImportBtn(true);
        setFile(e.target.files[0]);
      } else {
        setShow(false);
        setShowImportBtn(false);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  return (
    <div>
      <Button sx={{ m: 1 }} variant="contained" onClick={handleUploadClick}>
        {'Select & import csv'}
      </Button>
      <br />
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept={'.csv'}
      />
      {!show && (
        <Typography color={'red'}>
          The file name must start with &quot;cb_ &quot; and must end with the
          suffix &quot;.csv&quot;
        </Typography>
      )}
    </div>
  );
};
