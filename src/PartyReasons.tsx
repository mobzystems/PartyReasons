import { useContext, useState } from "react";
import { AppContext } from "./App";
import { combinations } from "./combinations";
import moment from "moment";

interface InterestingDate {
  name: string,
  date: moment.Moment
}

function SingleDate(props: { date: InterestingDate }) {
  return (<>
    <tr>
      <td>{props.date.name}</td>
      <td>{props.date.date.format('LL')}</td>
    </tr>
  </>);
}

function NewDate(props: { onAddDate: (date: InterestingDate) => void }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState<moment.Moment>();

  return (<>
    <form onSubmit={(e) => { e.preventDefault(); if (date !== undefined) props.onAddDate({ name: name, date: date }) }}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="yyyy-mm-dd" onChange={(e) => setDate(moment(e.target.value))} />
      <input type="submit" value="Add" />
    </form>
  </>);
}

function Combination(props: { refDate: moment.Moment, dates: InterestingDate[] }) {
  const ages = props.dates.map(d => { return { name: d.name, date: d.date, days: props.refDate.diff(d.date, 'days') } });
  const totalDays = ages.map(d => d.days).reduce((prev, curr) => prev + curr);
  const totalWeeks = totalDays / 7;

  return (
    <td>
      {totalDays} days
      {totalDays % 7 === 0 && <>, <b>{`${totalWeeks} weeks`}</b></>}
      {props.dates.length === 1 && props.dates[0].date.date() === props.refDate.date() && `, ${props.refDate.diff(props.dates[0].date, 'months')} months`}
      {props.dates.length === 1 && props.dates[0].date.date() === props.refDate.date() && props.dates[0].date.month() === props.refDate.month() && <>, <b>{`${props.refDate.diff(props.dates[0].date, 'years')} years`}</b></>}
    </td>
  );
}

export function PartyReasons() {
  const context = useContext(AppContext);
  const [firstDay, setFirstDay] = useState<moment.Moment>(moment().startOf('day'));
  const [dates, setDates] = useState<InterestingDate[]>([]);

  const allCombinations = combinations(dates);

  const days: moment.Moment[] = [];
  for (let i = 0; i < 10; i++) {
    let d = firstDay.clone();
    d.add(i, 'days');
    days.push(d);
  }

  return (<>
    <h1 className="title">Hello, {context.name}</h1>
    <table className="table">
      <thead>
        <tr>
          <th>What</th>
          <th>When</th>
        </tr>
      </thead>
      <tbody>
        {dates.map(d => <SingleDate key={d.name} date={d} />)}
      </tbody>
    </table>
    <NewDate onAddDate={(date) => setDates([...dates, date])} />
    <div className="level has-text-left">
      <button className="button" onClick={() => setFirstDay(firstDay.clone().subtract(1, 'days'))}>&lt;</button>
      { firstDay.format('LL') }
      <button className="button" onClick={() => setFirstDay(firstDay.clone().add(1, 'days'))}>&gt;</button>
    </div>
    <table className="table is-striped">
      <thead>
        <tr>
          <th>Who</th>
          {days.map(d => <th key={d.toISOString()}>{d.format('LL')}</th>)}
        </tr>
      </thead>
      <tbody>
        {allCombinations.map(dates => 
        <tr key={dates.map(d => d.name).join('/')}>
          <td>
            <ul>
              {dates.map(d => <li key={d.name}>{d.name}</li>)}
            </ul>
          </td>
          {days.map(refDate => <Combination key={dates.map(d => d.name).join('/') + '/' + refDate.format()} refDate={refDate} dates={dates} />)}
        </tr>)}
      </tbody>
    </table>
  </>);
}


