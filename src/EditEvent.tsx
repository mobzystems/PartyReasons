import { useState } from "react";
import { EventType, InterestingDate } from "./PartyReason";
import moment from "moment";

export default function EditEvent(
  props: {
    event: InterestingDate,
    onOK: (oldEvent: InterestingDate, newEvent: InterestingDate) => string | undefined,
    onCancel: () => void
  }
) {
  const [type, setType] = useState<EventType>(props.event.type);
  const [name, setName] = useState(props.event.name);
  const [date, setDate] = useState(props.event.date.format('YYYY-MM-DD'));
  const [dateIsValid, setDateIsValid] = useState(true);
  const [error, setError] = useState<string>();

  return (<>
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="field">
          <label className="label">Type</label>
          <div className="control">
            <div className="buttons has-addons">
              <button
                className={`button ${type === 'birthdate' ? 'is-info' : ''}`}
                onClick={(e) => setType('birthdate')}
              >
                <span className="icon">
                  <i className="fas fa-user"></i>
                </span>
                <span>Birth date</span>
              </button>
              <button
                className={`button ${type === 'event' ? 'is-info' : ''}`}
                onClick={(e) => setType('event')}
              >
                <span className="icon">
                  <i className="far fa-calendar-alt"></i>
                </span>
                <span>Event</span>
              </button>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input className="input" type="text" placeholder={type === 'birthdate' ? 'Name' : 'Date'} value={name} onChange={(e) => setName(e.target.value)} />
            {error !== undefined && <p className="help is-danger">{error}</p>}
          </div>
        </div>
        <div className="field">
          <label className="label">Date</label>
          <div className="control">
            <input className="input" type="text" placeholder="yyyy-mm-dd" pattern="\d{4}-\d{2}-\d{2}" value={date} onChange={(e) => {
              setDate(e.target.value);
              setDateIsValid(e.target.value.match(/\d{4}-\d{2}-\d{2}/) !== null && moment(e.target.value).isValid());
            }} />
          </div>
        </div>

        <div className="buttons is-justify-content-end">
          <button
            className="button is-success"
            onClick={() => {
              const msg = props.onOK(props.event, { name: name, date: moment(date), type: type });
              if (msg !== undefined)
                setError(msg);
            }}
            disabled={!(dateIsValid && name !== '')}
          >
            OK
          </button>
          <button className="button is-light" onClick={() => props.onCancel()}>Cancel</button>
        </div>
      </div>
    </div>
  </>);
}