export type Settings = {
  gutter: 5;
  item_gutter: 1;
  width: 1000;
  height: 200;
  item_size: 10;
  label_padding: 40;
  max_block_height: 20;
  transition_duration: 500;
  tooltip_width: 250;
  tooltip_padding: 15;
};

export type Data = {
    date: string;
    total: number;
    summary: {
        name: string;
        value: number;
    }[];
    details: {
        name: string;
        value: number;
    }[];
}

export type Container = HTMLDivElement
