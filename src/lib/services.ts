export type Condition = { title: string; text: string; image?: string };

export type Discipline = {
  icon: string;
  title: string;
  text: string;
  conditions: Condition[];
};
