import { combinations } from "./combinations";

export interface InterestingDate {
  name: string,
  date: moment.Moment
}

export type PartyReasonQuality = 'fantastic' | 'excellent' | 'good' | 'so-so' | 'awful';

export class PartyReason {
  constructor(public quality: PartyReasonQuality, public reason: string) {}
}

export class PartyReasonGenerator {
  private combinations: number[][] = [];

  constructor(private dates: InterestingDate[]) {
    // Generate combinations of all INDEXES
    this.combinations = combinations(Array.from(Array(dates.length).keys()));
  }

  getPartyReasons = (date: moment.Moment): PartyReason[] => {
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
            // The month matches too!
            const years = date.diff(p.date, 'years');
            let quality: PartyReasonQuality = 'awful';
            if (years % 25 === 0 || years % 10 === 0)
              quality = 'fantastic';
            else
              quality = 'excellent';
            reasons.push(new PartyReason(quality, `${p.name} is ${years} years old`));
          } else {
            // Not same month - maybe nice number of months?
            const months = date.diff(p.date, 'months');
            let quality: PartyReasonQuality = 'awful';
            if (months % 100 === 0)
              quality = 'fantastic';
            else if (months % 25 === 0)
              quality = 'excellent';
            else if (months % 10 === 0)
              quality = 'good';
            else if (months % 5 === 0)
              quality = 'so-so';
            reasons.push(new PartyReason(quality, `${p.name} is ${months} months old`));
          }
        }
      }

      // 1+ people: weeks and days
      const totalDays = c.reduce((prev, curr) => prev + ageInDays[curr], 0);
      if (totalDays % 7 === 0) {
        const weeks = totalDays / 7;
        let quality: PartyReasonQuality | undefined = undefined;
        if (weeks % 500 === 0)
          quality = 'fantastic';
        else if (weeks % 100 === 0)
          quality = 'excellent';
        else if (weeks % 50 === 0)
          quality = 'good';
        else if (weeks % 10 === 0)
          quality = 'so-so';
        else if (weeks % 5 === 0)
          quality = 'awful';
        if (quality)
          reasons.push(new PartyReason(quality, `${combiName} is ${weeks} weeks`));
      }

      let quality: PartyReasonQuality | undefined = undefined;
      if (totalDays % 5000 === 0)
        quality = 'fantastic';
      else if (totalDays % 1000 === 0)
        quality = 'excellent';
      else if (totalDays % 500 === 0)
        quality = 'good';
      else if (totalDays % 250 === 0)
        quality = 'so-so';
      else if (totalDays % 100 === 0)
        quality = 'awful';
      if (quality)
        reasons.push(new PartyReason('awful', `${combiName} is ${totalDays} days`));
    }

    return reasons;
  }
}
