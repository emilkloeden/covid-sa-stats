const parseDate = d => new Date(d.x.slice(-4) + "-" + d.x.slice(3,5) + "-" + d.x.slice(0,2));

const process = (rawData => {
  const casesPerDay = rawData.newcase_sa_char.data;
  const testsPerDay = rawData.laboratory_daily.data;

  const casesArray = casesPerDay.map(d => { 
    const date = parseDate(d); 
    return {
      x: d.x, 
      date, 
      cases: d.y
    };
  });
  
  const testsArray = testsPerDay.map(d => { 
    const date = parseDate(d);  
    return {
      x: d.x, 
      date, 
      tests: d.y
    };
  });
  
  return casesArray.map(caseDay => {
    const {x, date, cases} = caseDay;
    
    testsArray.forEach(testDay => {
      const testDate = testDay.x;
      const {tests} = testDay;
      if (testDate == x) {
        caseDay.tests = tests;
        caseDay.percentPositive = cases / tests;
      }
    });
    return caseDay;
  })
  .sort((a,b) => a.x - b.x);
  
});

const jsonURL = "https://www.covid-19.sa.gov.au/__data/assets/file/0004/145849/covid_19_daily.json";

fetch(jsonURL)
  .then(res => res.json())
  .then(process)
  .then(console.log);
