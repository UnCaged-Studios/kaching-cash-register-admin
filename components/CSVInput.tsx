import { Button, Typography } from '@mui/material';
import { ChangeEvent, FC, useContext, useRef, useState } from 'react';
import { CsvDataService } from '../utils/csv-data.service';
import { csvFileToArray } from '../utils/csvFileToArray';
import { CashBoxContext } from './ka-ching/cash-register/CreateCashBox';

export const CSVInput: FC = () => {
  const { setFile, setCsvArr, setShowPartOne, setShowPartTwo, resetValues } =
    useContext(CashBoxContext);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const csvTemplate = [
    {
      cashRegisterID: '--ID Here--',
      mintAddress: '--Mint Here--',
      amount: '--Amount Here--',
      decimal: '--Decimal Here--',
    },
  ];

  const handleUploadClick = () => {
    resetValues();
    inputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) {
        return;
      }
      const fileName = e.target.files[0].name;
      const startsWith = fileName.startsWith('cb_');
      if (startsWith) {
        setShowWarning(true);
        setShowPartOne(false);
        setShowPartTwo(true);
        setFile(e.target.files[0]);
        const csvArr = await csvFileToArray(
          (await e.target.files[0].text()).toString()
        );
        setCsvArr(csvArr);
      } else {
        setShowWarning(false);
        setShowPartOne(true);
        setShowPartTwo(false);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  return (
    <div>
      <Button sx={{ m: 1 }} variant="contained" onClick={handleUploadClick}>
        {'Import CSV'}
      </Button>
      <br />
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept={'.csv'}
      />
      {!showWarning && (
        <div>
          <Typography color={'red'}>
            The file name must start with &quot;cb_ &quot; and must end with the
            suffix &quot;.csv&quot;
          </Typography>
          <Button
            sx={{ m: 1 }}
            variant="contained"
            onClick={() => {
              CsvDataService.exportToCsv('cb_csvTemplate.csv', csvTemplate);
            }}
          >
            download csv template
          </Button>
        </div>
      )}
    </div>
  );
};
