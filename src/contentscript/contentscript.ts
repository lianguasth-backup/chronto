import * as moment from 'moment';

const report = document.getElementsByClassName("TableReportPrint")[0];
console.log("report is: ")
console.log(report)

const FULL_NAME = "User Full Name";
const USER_ID = "Count User ID";
const PATHWAY_NAME = "Path the project is associated with";
const PROJECT_TYPE = "Project Type";
const REQUIRED = "Required";
const TRANSCRIPT_STATUS = "Transcript Status";

export interface IToastmasterProgress {
    [id: string]: Toastmaster
}

interface Toastmaster {
    id: string,
    name: string,
    pathways: IPathway,
}

export interface IPathway {
    [name: string] : Pathway;
} 

interface Pathway {
    name: string,
    cntCompleted: number,
    cntTotal: number,
    completedAt: moment.Moment | null,
    startedAt: moment.Moment | null,
}

const getHeader = (table) => {
    const header = [];
    for(var i = 0, cell; cell = table.rows[0].cells[i]; i++) {
        header.push(cell.textContent);
    }
    return header;
}

const getRowDict = (row, header) => {
    const rowDict = {}
    for(var i = 0, cell; cell = row[0].cell; i++) {
        rowDict[header[i]] = cell[i].textContent;
    }
    return rowDict
}

const processProgress = (rowDicts) => {
    const toastmasters: IToastmasterProgress = {};
    for(let rowDict of rowDicts) {
        // ignore illegal users
        if(!rowDict[USER_ID] || !rowDict[FULL_NAME]) {
            continue;
        }
        // init user if first appears
        if(!toastmasters[rowDict[USER_ID]]) {
            toastmasters[rowDict[USER_ID]] = {
                id: rowDict[USER_ID],
                name: rowDict[FULL_NAME],
                pathways: {},
            }
        }
        // init pathway dict if first appear
        const pathways = toastmasters[rowDict[USER_ID]].pathways;
        if(!pathways[rowDict[PATHWAY_NAME]]) {
            pathways[rowDict[PATHWAY_NAME]] = {
                name: rowDict[PATHWAY_NAME],
                cntCompleted: 0,
                cntTotal: 0,
                startedAt: null,
                completedAt: null,
            }
        }
        // ignore the optional projects for now
        if(rowDict[PROJECT_TYPE] != REQUIRED) {
            continue;
        }
        // TODO: fill the updated at and the complete at
        const pathway = pathways[rowDict[PATHWAY_NAME]];
        pathway.cntTotal += 1;
        if(rowDict[TRANSCRIPT_STATUS] === "Completed") {
            pathway.cntCompleted += 1;
        }
   }
   return toastmasters;
}

const getProgressOnLevel = (levelReportTable) => {
    console.log(levelReportTable.rows);
    const header = getHeader(levelReportTable)
    const rowDicts = [];
    // 
    for (var i = 1, row; row = levelReportTable.rows[i]; i++) {
        const rowDict = getRowDict(row, header);
        rowDicts.push(rowDict)
    }
    //
    return processProgress(rowDicts);
}

const progressOnLevel = getProgressOnLevel(report);
console.log("get level");
console.log(progressOnLevel);
