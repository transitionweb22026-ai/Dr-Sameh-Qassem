export type Condition = { title: string; text: string };

export type Discipline = {
  icon: string;
  title: string;
  text: string;
  conditions: Condition[];
};
