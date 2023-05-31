import { combinations } from "./combinations";
import Formatter from "./formatter";

export type EventType = 'event' | 'birthdate';

export interface InterestingDate {
  type: EventType;
  name: string,
  date: moment.Moment
}

export enum PartyReasonQuality {
  Awful,
  So_so,
  Good,
  Excellent,
  Fantastic,
}

export class PartyReason {
  constructor(
    public quality: PartyReasonQuality,
    public numberOfEvents: number,
    public parties: string,
    public reason: string
  ) {
  }
}

export class PartyReasonGenerator {
  private combinations: number[][] = [];

  constructor(private dates: InterestingDate[]) {
    // Generate combinations of all INDEXES
    this.combinations = combinations(Array.from(Array(dates.length).keys()));
  }

  getPartyReasons = (date: moment.Moment): PartyReason[] => {
    // Internal helper function: create a reason based on a series of predicates
    function MakeReason(parties: string, partyCount: number, n: number, type: string, decisions: { predicate: (x: number) => boolean, quality: PartyReasonQuality }[]) {
      const matchingPredicate = decisions.find(dec => dec.predicate(n));
      if (matchingPredicate !== undefined) {
        reasons.push(new PartyReason(matchingPredicate.quality, partyCount, parties, `${Formatter.formatNumber(n)} ${type}`));
      }
      // No predicate matches: do not add a reason
    }

    let reasons: PartyReason[] = [];

    // Calculate all ages in days:
    let ageInDays = this.dates.map(d => date.diff(d.date, 'days'));

    for (let c of this.combinations) {
      // Make a display name for the special dates involved
      // (the names of the dates joined with '+')
      const combiName = c.map(index => this.dates[index].name).join("+");
      // The total age in days of all dates involved
      const totalDays = c.reduce((prev, curr) => prev + ageInDays[curr], 0);

      // Calculate on back into the past
      const pastDate = date.clone().subtract(totalDays, 'days');

      // Is the 'past date' on the same day as "we"?
      if (pastDate.date() === date.date()) {
        // The day matches! Check the month, too:
        if (pastDate.month() === date.month()) {
          // The month matches too! So it must be a birthday. Count years
          MakeReason(combiName, c.length, date.diff(pastDate, 'years'), 'years', [
            { predicate: (n) => n % 25 === 0 || n % 10 === 0, quality: PartyReasonQuality.Fantastic },
            { predicate: (_) => true, quality: PartyReasonQuality.Excellent },
          ]);
        } else {
          // Not same month, so no birthday - count months
          MakeReason(combiName, c.length, date.diff(pastDate, 'months'), 'months', [
            { predicate: (n) => n % 100 === 0, quality: PartyReasonQuality.Fantastic },
            { predicate: (n) => n % 25 === 0, quality: PartyReasonQuality.Excellent },
            { predicate: (n) => n % 10 === 0, quality: PartyReasonQuality.Good },
            { predicate: (n) => n % 5 === 0, quality: PartyReasonQuality.So_so },
          ]);
        }
      }

      // Weeks and days can be done on the basis of totdal days only
      if (totalDays % 7 === 0) {
        MakeReason(combiName, c.length, totalDays / 7, 'weeks', [
          { predicate: (n) => n % 1000 === 0, quality: PartyReasonQuality.Fantastic },
          { predicate: (n) => n % 500 === 0, quality: PartyReasonQuality.Excellent },
          { predicate: (n) => n % 250 === 0, quality: PartyReasonQuality.Good },
          { predicate: (n) => n % 100 === 0, quality: PartyReasonQuality.So_so },
          { predicate: (n) => n % 25 === 0, quality: PartyReasonQuality.Awful },
        ]);
      }

      MakeReason(combiName, c.length, totalDays, 'days', [
        { predicate: (n) => n % 5000 === 0, quality: PartyReasonQuality.Fantastic },
        { predicate: (n) => n % 1000 === 0, quality: PartyReasonQuality.Excellent },
        { predicate: (n) => n % 500 === 0, quality: PartyReasonQuality.Good },
        { predicate: (n) => n % 250 === 0, quality: PartyReasonQuality.So_so },
        { predicate: (n) => n % 100 === 0, quality: PartyReasonQuality.Awful },
      ]);
    }

    return reasons;
  }
}