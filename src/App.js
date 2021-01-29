import {
  AppBar,
  CssBaseline,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  makeStyles,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./styles.css";

const useStyles = makeStyles((theme) => ({
  container: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  gridContainer: {
    marginTop: 10
  },
  gridItem: {
    width: 100
  },
  typographyName: {
    textAlign: "left",
    fontSize: 20
  },
  typographyValue: {
    textAlign: "left",
    marginLeft: 40,
    fontSize: 20
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  favorites: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    border: "1px solid #aaa"
  }
}));

export default function App() {
  // const mockData = {
  //   rates: {
  //     CAD: 1.5453,
  //     HKD: 9.3911,
  //     ISK: 157.0,
  //     PHP: 58.27,
  //     DKK: 7.4377,
  //     HUF: 360.9,
  //     CZK: 26.025,
  //     AUD: 1.5744,
  //     RON: 4.8753,
  //     SEK: 10.1139,
  //     IDR: 17123.2,
  //     INR: 88.438,
  //     BRL: 6.4967,
  //     RUB: 91.7258,
  //     HRK: 7.559,
  //     JPY: 125.87,
  //     THB: 36.342,
  //     CHF: 1.0759,
  //     SGD: 1.6088,
  //     PLN: 4.552,
  //     BGN: 1.9558,
  //     TRY: 8.9542,
  //     CNY: 7.8411,
  //     NOK: 10.4555,
  //     NZD: 1.6844,
  //     ZAR: 18.4379,
  //     USD: 1.2114,
  //     MXN: 24.4497,
  //     ILS: 3.9556,
  //     GBP: 0.88395,
  //     KRW: 1340.79,
  //     MYR: 4.9007
  //   },
  //   base: "EUR",
  //   date: "2021-01-27"
  // };

  const classes = useStyles();
  const [currencyList, setCurrencyList] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [isCurrency, setIsCurrency] = useState("USD");
  const [currencyValue, setCurrencyValue] = useState(1);
  const [currencyRate, setCurrencyRate] = useState(1);
  const [outputValue, setOutputValue] = useState(1);

  const [favorites, setFavorites] = useState([]);

  const handleChange = (e) => {
    const currency = e.target.value;
    setIsCurrency(currency);
    setCurrencyValue(1);
  };

  const handleCurrencyValue = (e) => {
    const inputValue = parseInt(e.target.value, 10);
    inputValue ? setCurrencyValue(inputValue) : setCurrencyValue(1);
  };

  useEffect(() => {
    currencyList.forEach((item) => {
      if (item[0] === isCurrency) setCurrencyRate((1 / item[1]).toFixed(4));
    });
  }, [isCurrency, currencyList]);

  useEffect(() => {
    currencyValue
      ? setOutputValue((currencyValue * currencyRate).toFixed(4))
      : setOutputValue(0);
  }, [currencyValue, currencyRate]);

  const handleClickFavorites = (item) => {
    const favorArr = [...favorites];
    const isExist = favorArr.filter((favor) => favor[0] === item[0]);
    if (isExist.length === 0) setFavorites((favorites) => [...favorites, item]);
  };

  const handleFavoriteOut = (item) => {
    const favorArr = [...favorites];
    const elem = favorArr.filter((favor) => favor[0] !== item[0]);

    setFavorites(elem);
  };

  useEffect(() => {
    fetch("https://api.exchangeratesapi.io/latest")
      .then((response) => response.json())
      .then((data) => setCurrencyList(Object.entries(data.rates)));
  }, []);

  return (
    <div>
      <CssBaseline />
      <AppBar position="static">
        <Tabs value={tabValue}>
          <Tab label="Table" onClick={() => setTabValue(0)} />
          <Tab label="Calculator" onClick={() => setTabValue(1)} />
        </Tabs>
      </AppBar>

      {tabValue === 0 && (
        <>
          <div className={classes.favorites}>
            <Typography variant="subtitle1" gutterBottom>
              Favorites
            </Typography>
            <Divider />
            <br />
            {favorites && (
              <Grid container spacing={2}>
                {favorites.map((item) => (
                  <Grid item key={item} onClick={() => handleFavoriteOut(item)}>
                    {item[0]} {item[1]}
                  </Grid>
                ))}
              </Grid>
            )}
          </div>
          <Typography variant="h4" component="h1" align="center">
            Currency Rates Table
          </Typography>
          <br />
          <Divider />
          <div className={classes.container} style={{ width: 250 }}>
            {currencyList &&
              currencyList.map((item) => (
                <ListItem
                  key={item[0]}
                  name={item[0]}
                  rate={item[1]}
                  onClick={() => handleClickFavorites(item)}
                />
              ))}
          </div>
          <br />
        </>
      )}
      {tabValue === 1 && (
        <>
          <form>
            <Grid container spacing={2} alignItems="center" justify="center">
              <Grid item>
                <FormControl className={classes.formControl}>
                  <Select
                    value={isCurrency}
                    onChange={handleChange}
                    displayEmpty
                    className={classes.selectEmpty}
                  >
                    <MenuItem value={isCurrency}>
                      <em>{isCurrency}</em>
                    </MenuItem>
                    {currencyList.map((item) => (
                      <MenuItem key={item[0]} value={item[0]}>
                        {item[0]}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Currency I have</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <Input
                  placeholder="1"
                  color="primary"
                  type="number"
                  value={currencyValue}
                  onChange={handleCurrencyValue}
                  min={0.01}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" justify="center">
              <Grid item>
                <FormControl className={classes.formControl}>
                  <Select
                    value="EUR"
                    onChange={handleChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    inputProps={{ readOnly: true }}
                  >
                    <MenuItem value="EUR">
                      <em>EUR</em>
                    </MenuItem>
                  </Select>
                  <FormHelperText>Currency I want</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <Input placeholder="1" color="primary" value={outputValue} />
              </Grid>
            </Grid>
          </form>
        </>
      )}
    </div>
  );
}

const ListItem = ({ name, rate, onClick }) => {
  const classes = useStyles();

  return (
    <>
      <Grid container item justify="center" className={classes.gridContainer}>
        <Grid item className={classes.gridItem}>
          <Typography
            variant="subtitle1"
            className={classes.typographyName}
            onClick={onClick}
          >
            {name}:
          </Typography>
        </Grid>
        <Grid item className={classes.gridItem}>
          <Typography className={classes.typographyValue}>{rate}</Typography>
        </Grid>
      </Grid>
      <Divider />
    </>
  );
};
