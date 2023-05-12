import { useContext, useEffect, useState } from "react";
import { AppContext } from "./App";
// import { combinations } from "./combinations";
import moment from "moment";
import { InterestingDate, PartyReason, PartyReasonGenerator, PartyReasonQuality } from "./PartyReason";

function SingleDate(props: { date: InterestingDate, selected: boolean, onSelectionChanged: (selected: boolean) => void }) {
  return (<>
    <tr>
      <td align="center">
        <input
          className="checkbox"
          type="checkbox"
          defaultChecked={props.selected}
          onChange={(e) => props.onSelectionChanged(e.target.checked)}
        />
      </td>
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
      <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="yyyy-mm-dd" onChange={(e) => setDate(moment(e.target.value))} />
      <input type="submit" value="Add" />
    </form>
  </>);
}

// function Combination(props: { refDate: moment.Moment, dates: InterestingDate[] }) {
//   const ages = props.dates.map(d => { return { name: d.name, date: d.date, days: props.refDate.diff(d.date, 'days') } });
//   const totalDays = ages.map(d => d.days).reduce((prev, curr) => prev + curr);
//   const totalWeeks = totalDays / 7;

//   return (
//     <td>
//       {totalDays} days
//       {totalDays % 7 === 0 && <>, <b>{`${totalWeeks} weeks`}</b></>}
//       {props.dates.length === 1 && props.dates[0].date.date() === props.refDate.date() && `, ${props.refDate.diff(props.dates[0].date, 'months')} months`}
//       {props.dates.length === 1 && props.dates[0].date.date() === props.refDate.date() && props.dates[0].date.month() === props.refDate.month() && <>, <b>{`${props.refDate.diff(props.dates[0].date, 'years')} years`}</b></>}
//     </td>
//   );
// }

export function PartyReasons() {
  const context = useContext(AppContext);

  const [firstDay, setFirstDay] = useState<moment.Moment>(moment().startOf('day'));
  const [days, setDays] = useState<moment.Moment[]>([]);
  const [dates, setDates] = useState<InterestingDate[]>([]);
  const [selectedNames, setSelectedNames] = useState(new Set<string>());
  const [partyReasons, setPartyReasons] = useState<{ date: moment.Moment, reason: PartyReason }[]>([]);
  const [minimumQuality, setMinimumQuality] = useState(PartyReasonQuality.Good);

  // const allCombinations = combinations(dates.filter(d => selectedNames.has(d.name)));

  useEffect(() => {
    if (context.name === 'markus') {
      const myDates = [
        { name: 'markus', date: moment('1964-05-03') },
        { name: 'annemarie', date: moment('1964-08-18') },
        { name: 'tobias', date: moment('2001-11-26') },
        { name: 'stephanie', date: moment('2003-07-11') }
      ];
      setDates(myDates);
      setSelectedNames(new Set(myDates.map(d => d.name)));
    } else {
      setDates([]);
    }
  }, [context]);


  // Create date list if first date changes
  useEffect(() => {
    const days: moment.Moment[] = [];
    for (let i = 0; i < 7; i++) {
      let d = firstDay.clone();
      d.add(i, 'days');
      days.push(d);
    }
    setDays(days);
  }, [firstDay]);

  useEffect(() => {
    const generator = new PartyReasonGenerator(dates.filter(d => selectedNames.has(d.name)));
    const newReasons = [];
    for (const day of days) {
      const reasons = generator.getPartyReasons(day);
      for (const r of reasons) {
        newReasons.push({ date: day, reason: r });
      }
    }

    setPartyReasons(newReasons);
  }, [dates, days, selectedNames]);

  return (<>
    <h1 className="title">Hello, {context.name}</h1>
    <table className="table is-NOT-sticky">
      <thead>
        <tr>
          <th align="center">Select</th>
          <th>What</th>
          <th>When</th>
        </tr>
      </thead>
      <tbody>
        {dates.map(d => <SingleDate
          key={d.name}
          date={d}
          selected={selectedNames.has(d.name)}
          onSelectionChanged={(s) => {
            const names = new Set(selectedNames);
            if (s)
              names.add(d.name);
            else
              names.delete(d.name);
            setSelectedNames(names);
          }}
        />)}
      </tbody>
    </table>
    <NewDate onAddDate={(date) => { setDates([...dates, date]); setSelectedNames(selectedNames.add(date.name)) }} />
    <div className="level">
      <div className="level-left">
        <button className="button" onClick={() => setFirstDay(firstDay.clone().subtract(7, 'days'))}>&laquo;</button>
        <button className="button" onClick={() => setFirstDay(firstDay.clone().subtract(1, 'days'))}>&lt;</button>
        {firstDay.format('LL')}
        <button className="button" onClick={() => setFirstDay(firstDay.clone().add(1, 'days'))}>&gt;</button>
        <button className="button" onClick={() => setFirstDay(firstDay.clone().add(7, 'days'))}>&raquo;</button>
      </div>
    </div>
    <div>
      Show only reasons <select className="select" value={minimumQuality} onChange={e => setMinimumQuality(parseInt(e.target.value))}>
      <option value={PartyReasonQuality.Fantastic}>{PartyReasonQuality[PartyReasonQuality.Fantastic]}</option>
      <option value={PartyReasonQuality.Excellent}>{PartyReasonQuality[PartyReasonQuality.Excellent]}</option>
      <option value={PartyReasonQuality.Good}>{PartyReasonQuality[PartyReasonQuality.Good]}</option>
      <option value={PartyReasonQuality.So_so}>{PartyReasonQuality[PartyReasonQuality.So_so].replace('_', '-')}</option>
      <option value={PartyReasonQuality.Awful}>{PartyReasonQuality[PartyReasonQuality.Awful]}</option>
    </select> or better
    </div>
    <table className="table is-striped is-sticky">
      <tbody>
        {partyReasons.filter(pr => pr.reason.quality >= minimumQuality).map(pr =>
          <tr key={pr.reason.reason}>
            <td>{pr.date.format('LL')}</td>
            <td>{PartyReasonQuality[pr.reason.quality].replace('_', '-')}</td>
            <td>{pr.reason.reason}</td>
          </tr>
        )}
      </tbody>
    </table>
    {/* <table className="table is-striped is-sticky">
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
    </table> */}
  </>);
}


