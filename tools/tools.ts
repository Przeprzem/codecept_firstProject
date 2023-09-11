import { SortType } from "../enums/tools.dicts";

const { I } = inject();

class Tools {
    constructor() {

    }
    // insert your methods here
    async _sortTable(tableToSort: number[], sortingType: SortType = SortType.asc) {
        tableToSort;
        let tableSorted: number[] = [];
        switch (sortingType) {
            case SortType.desc:
                do {
                    for (let index = 0; index < tableToSort.length; index++) {
                        if (tableToSort[index] === Math.max(...tableToSort)) {
                            tableSorted.push(tableToSort[index]);
                            tableToSort.splice(index, 1);
                            index--;
                        }
                    }
                } while (tableToSort.length > 0);
                break;
            case SortType.asc:
                do {
                    for (let index = 0; index < tableToSort.length; index++) {
                        if (tableToSort[index] === Math.min(...tableToSort)) {
                            tableSorted.push(tableToSort[index]);
                            tableToSort.splice(index, 1);
                            index--;
                        }
                    }
                } while (tableToSort.length > 0);
                break;

            default:
                break;
        }
        return tableSorted
    }

}

// For inheritance
module.exports = new Tools();
export = Tools;