import { useContext, useEffect, useState } from "react";
import { AppContext } from "./App";
// import { combinations } from "./combinations";
import moment from "moment";
import { InterestingDate, PartyReason, PartyReasonGenerator, PartyReasonQuality } from "./PartyReason";

function QualityTag(props: { quality: PartyReasonQuality }) {
  switch (props.quality) {
    case PartyReasonQuality.Fantastic:
      return <span className="tag is-success">Fantastic</span>;
    case PartyReasonQuality.Excellent:
      return <span className="tag is-primary">Excellent</span>;
    case PartyReasonQuality.Good:
      return <span className="tag is-warning">Good</span>;
    case PartyReasonQuality.So_so:
      return <span className="tag is-light">So-so</span>;
    case PartyReasonQuality.Awful:
      return <span className="tag is-dark">Awful</span>;
  }
}

function SingleDate(props: {
  date: InterestingDate,
  selected: boolean,
  onSelected: (selected: boolean) => void,
  onDelete: (name: string) => void
}) {
  return (<>
    <tr>
      <td align="center">
        <input
          className="checkbox"
          type="checkbox"
          defaultChecked={props.selected}
          onChange={(e) => props.onSelected(e.target.checked)}
        />
      </td>
      <td>{props.date.name}</td>
      <td>{props.date.date.format('LL')}</td>
      <td><button className="button is-small is-danger" onClick={() => props.onDelete(props.date.name)}>Delete</button></td>
    </tr>
  </>);
}

function NewDate(props: { onAddDate: (date: InterestingDate) => void }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState<moment.Moment>();

  return (<>
    <form className="block" onSubmit={(e) => { e.preventDefault(); if (date !== undefined) props.onAddDate({ name: name, date: date }) }}>
      <div className="field is-grouped">
        <p className="control is-expanded">
          <input className="input" type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        </p>
        <p className="control">
          <input className="input" type="text" placeholder="yyyy-mm-dd" onChange={(e) => setDate(moment(e.target.value))} />
        </p>
        <p className="control">
          <input className="button is-info" type="submit" value="Add" />
        </p>
      </div>
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

  const [firstDay, setFirstDay] = useState<moment.Moment>(moment().startOf('month').startOf('day'));
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
    for (let i = 0; i < 31; i++) {
      let d = firstDay.clone();
      d.add(i, 'days');
      if (d.month() !== firstDay.month())
        break;
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

  const filteredReasons = partyReasons.filter(pr => pr.reason.quality >= minimumQuality /* && pr.reason.numberOfParties >= 4 */);

  return (<>
    <h1 className="title">Party Reason Generator</h1>
    {dates.length === 0
      ? <p>To get started, enter one or more names and dates, please</p>
      : <table className="table is-narrow is-striped is-NOT-sticky">
        <thead>
          <tr>
            <th align="center"><input type="checkbox" disabled /></th>
            <th>What</th>
            <th>When</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dates.map(d => <SingleDate
            key={d.name}
            date={d}
            selected={selectedNames.has(d.name)}
            onSelected={(s) => {
              const names = new Set(selectedNames);
              if (s)
                names.add(d.name);
              else
                names.delete(d.name);
              setSelectedNames(names);
            }}
            onDelete={(name) => {
              setDates(dates.filter(d => d.name !== name));
            }}
          />)}
        </tbody>
      </table>}
    <NewDate onAddDate={(date) => { setDates([...dates, date]); setSelectedNames(selectedNames.add(date.name)) }} />
    {dates.length > 0 && <>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item"><button className="button is-info" onClick={() => setFirstDay(firstDay.clone().subtract(1, 'months'))}>&#9664;</button></div>
          <div className="level-item" style={{ minWidth: 150 }}>{firstDay.format('MMMM YYYY')}</div>
          <div className="level-item"><button className="button is-info" onClick={() => setFirstDay(firstDay.clone().add(1, 'months'))}>&#9654;</button></div>
          <div className="level-item">Show only reasons</div>
          <div className="level-item">
            <select className="select" value={minimumQuality} onChange={e => setMinimumQuality(parseInt(e.target.value))}>
              <option value={PartyReasonQuality.Fantastic}>{PartyReasonQuality[PartyReasonQuality.Fantastic]}</option>
              <option value={PartyReasonQuality.Excellent}>{PartyReasonQuality[PartyReasonQuality.Excellent]}</option>
              <option value={PartyReasonQuality.Good}>{PartyReasonQuality[PartyReasonQuality.Good]}</option>
              <option value={PartyReasonQuality.So_so}>{PartyReasonQuality[PartyReasonQuality.So_so].replace('_', '-')}</option>
              <option value={PartyReasonQuality.Awful}>{PartyReasonQuality[PartyReasonQuality.Awful]}</option>
            </select>
          </div>
          <div className="level-item">or better</div>
        </div>
      </div>
      {filteredReasons.length === 0
        ? <p>No good enough party reasons in this period.</p>
        : <table className="table is-striped is-narrow is-NOT-sticky" id="reasons">
          <thead>
            <tr>
              <th>When</th>
              <th align="center"></th>
              <th align="center"></th>
              <th>Who</th>
              <th>What</th>
            </tr>
          </thead>
          <tbody>
            {filteredReasons.map(pr =>
              <tr key={pr.reason.reason}>
                <td>{pr.date.format('LL')}</td>
                <td align="center"><QualityTag quality={pr.reason.quality} /></td>
                <td align="center">{pr.reason.numberOfParties}</td>
                <td>{pr.reason.parties}</td>
                <td>{pr.reason.reason}</td>
              </tr>
            )}
          </tbody>
        </table>}
    </>}
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


