// parseData() {
//     if ( !this.props.data ) { return }

import { useMemo } from "react";
import { Data } from "../types";

//     // Get daily summary if that was not provided
//     if ( !this.props.data[0].summary ) {
//       this.props.data.map(d => {
//         let summary = d.details.reduce((uniques, project) => {
//           if (!uniques[project.name]) {
//             uniques[project.name] = {
//               'value': project.value
//             }
//           } else {
//             uniques[project.name].value += project.value
//           }
//           return uniques
//         }, {})
//         let unsorted_summary = Object.keys(summary).map(key => {
//           return {
//             'name': key,
//             'value': summary[key].value
//           }
//         })
//         d.summary = unsorted_summary.sort((a, b) => {
//           return b.value - a.value
//         })
//         return d
//       })
//     }
//   }

const parseData = (data: Data[]) => {
  if (!data) {
    return;
  }

  // Get daily summary if that was not provided
  if (!data[0].summary) {
    data.map((d) => {
      const summary = d.details.reduce((uniques, project) => {
        project.name;
        //@ts-ignore
        if (!uniques[project.name]) {
          //@ts-ignore
          uniques[project.name] = {
            value: project.value,
          };
        } else {
          //@ts-ignore
          uniques[project.name].value += project.value;
        }
        return uniques;
      }, {});
      const unsorted_summary = Object.keys(summary).map((key) => {
        return {
          name: key,
          //@ts-ignore
          value: summary[key].value,
        };
      });
      d.summary = unsorted_summary.sort((a, b) => {
        return b.value - a.value;
      });
      return d;
    });
  }
};

const useParseData = (data: Data[]) => {
  return useMemo(() => parseData(data), [data]);
};

export default useParseData;
