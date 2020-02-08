const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');
const uuid = require('uuid');
const morgan = require('morgan');

app.use(morgan('dev'));


app.use(express.json());

app.get('/api/companies', (req, res, next)=> {
  
  db.readJSON('./companies.json')
    .then( companies => {
      res.send(companies);
      companyList = companies;
    })
    .catch(next);
});

app.get('/', (req, res, next)=> {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/companies/', (req, res, next) => {
  const newCompany = {...req.body, id: uuid()};
  console.log(newCompany)
  db.readJSON('./companies.json')
    .then( companies => {
      return db.writeJSON('./companies.json',[newCompany, ...companies]);
    })
    .then( ()=> res.send(newCompany))
    

})

app.delete('/api/companies/:id', (req, res, next) => {
  
  db.readJSON('./companies.json')
    .then( companies => {

      const newCompanyList = companies.filter( company => company.id !== req.params.id);
      
      db.writeJSON('./companies.json', newCompanyList);
      res.sendStatus(204);
    })
  
})

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));
