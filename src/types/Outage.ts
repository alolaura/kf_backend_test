export interface Outage {
  id: string;
  begin: string;
  end: string;
}

export interface EnhancedOutage extends Outage {
  name: string;
}
