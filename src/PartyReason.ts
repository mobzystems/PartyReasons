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
    function MakeReason(parties: string, partyCount: number, n: number, type: string, decisions: { predicate: (x: number) => boolean, quality: PartyReasonQuality }[]): PartyReason | undefined {
      const matchingPredicate = decisions.find(dec => dec.predicate(n));
      if (matchingPredicate !== undefined) {
        const newReason = new PartyReason(matchingPredicate.quality, partyCount, parties, `${Formatter.formatNumber(n)} ${type}`);
        reasons.push(newReason);
        return newReason;
      }
      // No predicate matches: do not add a reason
      return undefined;
    }

    let reasons: PartyReason[] = [];

    // Calculate all ages in days:
    let ageInDays = this.dates.map(d => date.diff(d.date, 'days'));

    for (let c of this.combinations) {
      // Skip any combinations in which the age of an event is < 0:
      if (c.find((n => ageInDays[n] < 0)) !== undefined) {
        continue;
      }
      // Make a display name for the special dates involved
      // (the names of the dates joined with '+')
      const combiName = c.map(index => this.dates[index].name).join("+");
      // The total age in days of all dates involved
      const totalDays = c.reduce((prev, curr) => prev + ageInDays[curr], 0);

      // Calculate on back into the past
      const pastDate = date.clone().subtract(totalDays, 'days');

      // Is the 'past date' on the same day as "we"?
      if (pastDate.date() === date.date()) { // This is the day of the month!
        // The day matches! 
        if (pastDate.year() === date.year() && pastDate.month() === date.month()) {
          // If the year AND the month match, it's the date itself...
          let reason = MakeReason(combiName, c.length, 0, 'TODAY', [
            { predicate: (_) => true, quality: PartyReasonQuality.Fantastic },
          ]);
          reason!.reason = "Today";
        } else if (pastDate.month() === date.month()) {
          // The month matches too! So it must be a birthday. Count years
          MakeReason(combiName, c.length, date.diff(pastDate, 'years'), 'years', [
            { predicate: (n) => n % 25 === 0 || n % 10 === 0, quality: PartyReasonQuality.Fantastic },
            { predicate: (_) => true, quality: PartyReasonQuality.Excellent },
          ]);
        } else {
          // Not same month, so no birthday - count months
          MakeReason(combiName, c.length, date.diff(pastDate, 'months'), 'months', [
            { predicate: (n) => (n !== 0) && (n % 100 === 0), quality: PartyReasonQuality.Fantastic },
            { predicate: (n) => (n !== 0) && (n % 25 === 0), quality: PartyReasonQuality.Excellent },
            { predicate: (n) => (n !== 0) && (n % 10 === 0), quality: PartyReasonQuality.Good },
            { predicate: (n) => (n !== 0) && (n % 5 === 0), quality: PartyReasonQuality.So_so },
          ]);
        }
      }

      // Weeks and days can be done on the basis of total days only
      if (totalDays % 7 === 0) {
        // Make week reasons, but not for 0
        MakeReason(combiName, c.length, totalDays / 7, 'weeks', [
          { predicate: (n) => (n !== 0) && (n % 1000 === 0), quality: PartyReasonQuality.Fantastic },
          { predicate: (n) => (n !== 0) && (n % 500 === 0), quality: PartyReasonQuality.Excellent },
          { predicate: (n) => (n !== 0) && (n % 250 === 0), quality: PartyReasonQuality.Good },
          { predicate: (n) => (n !== 0) && (n % 100 === 0), quality: PartyReasonQuality.So_so },
          { predicate: (n) => (n !== 0) && (n % 25 === 0), quality: PartyReasonQuality.Awful },
        ]);
      }

      // Make day reasons - but not for 0
      MakeReason(combiName, c.length, totalDays, 'days', [
        { predicate: (n) => (n !== 0) && (n % 5000 === 0), quality: PartyReasonQuality.Fantastic },
        { predicate: (n) => (n !== 0) && (n % 1000 === 0), quality: PartyReasonQuality.Excellent },
        { predicate: (n) => (n !== 0) && (n % 500 === 0), quality: PartyReasonQuality.Good },
        { predicate: (n) => (n !== 0) && (n % 250 === 0), quality: PartyReasonQuality.So_so },
        { predicate: (n) => (n !== 0) && (n % 100 === 0), quality: PartyReasonQuality.Awful },
      ]);
    }

    return reasons;
  }
}