import * as moment from 'moment';
import { sendSlackNotification } from './slack'

const FULL_NAME = "User Full Name";
const USER_ID = "Count User ID";
const PATHWAY_NAME = "Path the project is associated with";
const PROJECT_TYPE = "Project Type";
const REQUIRED = "Required";
const TRANSCRIPT_STATUS = "Transcript Status";
const SLACK_CHANNEL = process.env.CHANNEL_ID;

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
    for(var i = 0, cell; cell = row.cells[i]; i++) {
        rowDict[header[i]] = cell.textContent;
    }
    return rowDict
}

const isEmptyString = (text: string | null | undefined) => {
    return (text || "").trim() === ""
}

const processProgress = (rowDicts) => {
    const toastmasters: IToastmasterProgress = {};
    for(let rowDict of rowDicts) {
        // ignore illegal users
        if(isEmptyString(rowDict[USER_ID]) || isEmptyString(rowDict[FULL_NAME])) {
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

const getLevel = (levelTable) => {
    // hacky way of getting the level char
    const strLength = 7;
    return levelTable.rows[0].cells[1].textContent.substring(0, strLength);
}

const getIndividualProgress = (individualProgress, completed: boolean) => {
    let text = "";
    text += "*Name: " + individualProgress.name + "*\n";
    text += "- Pathway: \n";
    for(let pathwayName in individualProgress.pathways) {
        const pw = individualProgress.pathways[pathwayName];
        let completedMark = "";
        if(completed) {
            completedMark = "[completed] :white_check_mark: ";
        }
        text += "\t\t * " + completedMark + " pathway name: " + pw.name
            + " required completed/total: " + pw.cntCompleted 
            + "/" + pw.cntTotal + "\n";
    }
    return text;
}

const isLevelCompleted = (individualProgress) => {
    for(let pathwayName in individualProgress.pathways) {
        const pw = individualProgress.pathways[pathwayName];
        if (pw.cntCompleted < pw.cntTotal) {
            return false;
        }
    }
    return true;
}

const printLevelProgress = (level, progress) => {
    let levelProgress = "========== Level: " + level + "================\n";
    levelProgress += "Individual progress: \n";
    
    const completed = [];
    const incompleted = [];
    for(let tm in progress) {
        const p = progress[tm];
        if(isLevelCompleted(p)) {
            completed.push(p);
        } else {
            incompleted.push(p);
        }
    }

    for(let p of incompleted) {
        levelProgress += getIndividualProgress(p, false);
    }

    for(let p of completed) {
        levelProgress += getIndividualProgress(p, true);
    }

    sendSlackNotification(levelProgress, SLACK_CHANNEL)
}

const summary = document.getElementsByClassName("TableReportPrintCriteria")[0];
const report = document.getElementsByClassName("TableReportPrint")[0];
console.log("report is: ")
console.log(report)
const level = getLevel(summary);
const progressOnLevel = getProgressOnLevel(report);
console.log("get level", level);
console.log(progressOnLevel);
printLevelProgress(level, progressOnLevel);
