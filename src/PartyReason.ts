import { combinations } from "./combinations";
import Formatter from "./formatter";

export interface InterestingDate {
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
    public numberOfParties: number,
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
      // for (const dec of decisions) {
      //   if (dec.predicate(n))
      //     reasons.push(new PartyReason(dec.quality, parties, `${Formatter.formatNumber(n)} ${type}`));
      // }
      // No predicate matches: do not add a reason
    }

    let reasons: PartyReason[] = [];

    // Calculate all ages in days:
    let ageInDays = this.dates.map(d => date.diff(d.date, 'days'));

    for (let c of this.combinations) {
      const combiName = c.map(index => this.dates[index].name).join("+");

      // For single events: create reasons for years and months
      if (c.length === 1) {
        const p = this.dates[c[0]]; // The first 'person'
        if (p.date.date() === date.date()) {
          // The day matches
          if (p.date.month() === date.month()) {
            // The month matches too! So it must be a birthday. Count years
            MakeReason(p.name, 1, date.diff(p.date, 'years'), 'years', [
              { predicate: (n) => n % 25 === 0 || n % 10 === 0, quality: PartyReasonQuality.Fantastic },
              { predicate: (_) => true, quality: PartyReasonQuality.Excellent },
            ]);
          } else {
            // Not same month, so no birthday - count months
            MakeReason(p.name, 1, date.diff(p.date, 'months'), 'months', [
              { predicate: (n) => n % 100 === 0, quality: PartyReasonQuality.Fantastic },
              { predicate: (n) => n % 25 === 0, quality: PartyReasonQuality.Excellent },
              { predicate: (n) => n % 10 === 0, quality: PartyReasonQuality.Good },
              { predicate: (n) => n % 5 === 0, quality: PartyReasonQuality.So_so },
            ]);
          }
        }
      }

      // 1+ people: weeks and days
      const totalDays = c.reduce((prev, curr) => prev + ageInDays[curr], 0);
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