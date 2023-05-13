export default class Formatter {
    static NumberFormat = new Intl.NumberFormat('nl-NL');
    static formatNumber = (n: number) : string => this.NumberFormat.format(n);
}