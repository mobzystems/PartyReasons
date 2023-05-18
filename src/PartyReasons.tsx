import { useContext, useEffect, useState } from "react";
import { AppContext } from "./App";
// import { combinations } from "./combinations";
import moment from "moment";
import { InterestingDate, PartyReason, PartyReasonGenerator, PartyReasonQuality } from "./PartyReason";

function QualityTag(props: { quality: PartyReasonQuality }) {
  switch (props.quality) {
    case PartyReasonQuality.Fantastic:
      return <span className="tag is-warning">Fantastic</span>;
    case PartyReasonQuality.Excellent:
      return <span className="tag is-success">Excellent</span>;
    case PartyReasonQuality.Good:
      return <span className="tag is-link">Good</span>;
    case PartyReasonQuality.So_so:
      return <span className="tag is-light">So-so</span>;
    case PartyReasonQuality.Awful:
      return <span className="tag is-dark">Awful</span>;
  }
}

function SingleEvent(props: {
  event: InterestingDate,
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
      <td>{props.event.name}</td>
      <td>{props.event.date.format('LL')}</td>
      <td><button className="button is-small is-danger" onClick={() => props.onDelete(props.event.name)}>Delete</button></td>
    </tr>
  </>);
}

function NewEvent(props: {
  onAddEvent: (event: InterestingDate) => void
  onValidateEvent: (event: InterestingDate) => string | undefined
}) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [dateIsValid, setDateIsValid] = useState(false);
  const [error, setError] = useState<string>();

  return (<>
    <form className="block" onSubmit={(e) => {
      e.preventDefault();
      const ev = { name: name, date: moment(date) };
      const msg = props.onValidateEvent(ev);
      if (msg === undefined) {
        props.onAddEvent(ev);
        setName('');
        setDate('');
      }
      else
        setError(msg);
    }}>
      <div className="field is-grouped">
        <div className="control is-expanded">
          <input className="input" type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
          {error !== undefined && <p className="help is-danger">{error}</p>}
        </div>
        <div className="control">
          <input className="input" type="text" style={{ width: 120 }} placeholder="yyyy-mm-dd" pattern="\d{4}-\d{2}-\d{2}" value={date} onChange={(e) => {
            setDate(e.target.value);
            setDateIsValid(e.target.value.match(/\d{4}-\d{2}-\d{2}/) !== null && moment(e.target.value).isValid());
          }} />
        </div>
        <div className="control">
          <input className="button is-info" type="submit" value="Add" disabled={!(dateIsValid && name !== '')} />
        </div>
      </div>
    </form>
  </>);
}

export function PartyReasons() {
  const context = useContext(AppContext);

  // The events, i.e. interesting dates
  const [events, setEvents] = useState<InterestingDate[]>([]);

  // The year to display
  const [year, setYear] = useState(moment().year());

  // The calculated party reasons
  const [partyReasons, setPartyReasons] = useState<{ date: moment.Moment, reason: PartyReason }[]>([]);

  // The names of the selected events, i.e. the ones to include in the reasons
  const [selectedNames, setSelectedNames] = useState(new Set<string>());

  // The minimum quality for an reason to show
  const [minimumQuality, setMinimumQuality] = useState(PartyReasonQuality.Good);
  // The minimum number of involved events for a reason to show
  const [minEvents, setMinEvents] = useState(1);

  useEffect(() => {
    if (context.name === 'markus') {
      const myDates = [
        { name: 'markus', date: moment('1964-05-03') },
        { name: 'annemarie', date: moment('1964-08-18') },
        { name: 'tobias', date: moment('2001-11-26') },
        { name: 'stephanie', date: moment('2003-07-11') }
      ];
      setEvents(myDates);
      setSelectedNames(new Set(myDates.map(d => d.name)));
    } else {
      setEvents([]);
    }
  }, [context]);

  useEffect(() => {
    const generator = new PartyReasonGenerator(events.filter(d => selectedNames.has(d.name)));
    const newReasons = [];

    let day = moment({ year: year, month: 0, day: 1 });
    do {
      const reasons = generator.getPartyReasons(day);
      for (const r of reasons) {
        newReasons.push({ date: day.clone(), reason: r });
      }
      day.add(1, 'days');
    } while (day.year() === year);

    setPartyReasons(newReasons);
  }, [events, year, selectedNames, minEvents]);

  function validateEvent(event: InterestingDate): string | undefined {
    if (events.find(e => e.name.toLowerCase() === event.name.toLowerCase()) !== undefined)
      return 'This name is already in use';
    // if (events.find(e => e.date.format('YYYY-MM-DD')  === event.date.format('YYYY-MM-DD')) !== undefined)
    return undefined;
  }

  // Get the minimum number of events. Cannot be less than the number of selected events
  let minE = minEvents;
  if (selectedNames.size < minE)
    minE = selectedNames.size;

  const filteredReasons = partyReasons.filter(pr => pr.reason.quality >= minimumQuality && pr.reason.numberOfEvents >= minE);

  return (<>
    <h1 className="title">Party Reasons!</h1>
    {events.length === 0
      ? <p>To get started, enter one or more names and dates, please</p>
      : <div className="table-container">
        <table className="table is-narrow is-striped is-NOT-sticky">
          <thead>
            <tr>
              <th align="center"><input type="checkbox" disabled /></th>
              <th>What</th>
              <th>When</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map(d => <SingleEvent
              key={d.name}
              event={d}
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
                setEvents(events.filter(d => d.name !== name));
              }}
            />)}
          </tbody>
        </table>
      </div>
    }
    <NewEvent
      onAddEvent={(event) => { setEvents([...events, event]); setSelectedNames(selectedNames.add(event.name)) }}
      onValidateEvent={(event) => validateEvent(event)}
    />
    {events.length > 0 && <>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item"><button className="button is-info" onClick={() => setYear(year - 1)}>&#9664;</button></div>
          <div className="level-item" style={{ minWidth: 50 }}>{year}</div>
          <div className="level-item"><button className="button is-info" onClick={() => setYear(year + 1)}>&#9654;</button></div>
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
          <div className="level-item">or better with at least </div>
          <div className="level-item"><input type="number" value={minEvents} onChange={(e) => setMinEvents(parseInt(e.target.value))} min={1} max={events.length} /></div>
          <div className="level-item">dates</div>
        </div>
      </div>
      {filteredReasons.length === 0
        ? <p>No good enough party reasons in this period.</p>
        : <table className="table is-striped is-narrow is-sticky" id="reasons">
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
              <tr key={pr.date.format('YYYY-MM-DD') + '/' + pr.reason.parties + '/' + pr.reason.reason}>
                <td>{pr.date.format('LL')}</td>
                <td align="center"><QualityTag quality={pr.reason.quality} /></td>
                <td align="center">{pr.reason.numberOfEvents}</td>
                <td>{pr.reason.parties}</td>
                <td>{pr.reason.reason}</td>
              </tr>
            )}
          </tbody>
        </table>}
    </>}
  </>);
}


