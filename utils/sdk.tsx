import { useEffect, useState } from 'react';

type resultProps = {
  email: string;
  gender: string;
};

export function MyComponent() {
  const [result, setResult] = useState<resultProps[]>([]);

  useEffect(() => {
    const api = async () => {
      const data = await fetch('https://randomuser.me/api', {
        method: 'GET',
      });
      const jsonData = await data.json();
      setResult(jsonData.results);
    };

    api();
  }, []);

  return (
    <div className="App">
      {result.map((value) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <div>
            <div>{value.email}</div>
            <div>{value.gender}</div>
          </div>
        );
      })}
    </div>
  );
}
