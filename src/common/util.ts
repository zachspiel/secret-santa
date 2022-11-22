/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GroupMember } from "./types";

const getListOfNames = (members: GroupMember[]): string[] => {
    return members.reduce((acc: string[], member) => [...acc, member.name], []);
};

const remove = (name: string, list: string[]) => list.filter((i) => i !== name);

const generateDraw = (
    namesInHat: string[],
    listRemaining: string[],
    secretSantaGroupMembersInfo: GroupMember[],
    retry = 0,
): GroupMember[] => {
    if (retry > 10) {
        throw new Error("Draw not possible");
    }
    const result = namesInHat.reduce((acc: any[], name: string) => {
        const currentMember = secretSantaGroupMembersInfo.find(
            (member) => member.name === name,
        );

        if (currentMember !== undefined) {
            const hasExclusions = currentMember.exclusions;
            const assignedTo = pickAName(name, listRemaining, hasExclusions);
            listRemaining = remove(assignedTo, listRemaining);
            return [...acc, { ...currentMember, name, assignedTo }];
        }
        return [...acc];
    }, []);

    if (result.some(({ assignedTo }) => !assignedTo)) {
        return generateDraw(
            namesInHat,
            Object.assign([], namesInHat),
            secretSantaGroupMembersInfo,
            retry + 1,
        );
    }
    return result;
};

const pickAName = (
    memberName: string,
    namesList: string[],
    exclusions: string[],
): string => {
    const filteredList = remove(memberName, namesList);

    let filteredListIncExclusions;
    if (exclusions && exclusions.length) {
        filteredListIncExclusions = filteredList.filter(
            (name) => !exclusions.includes(name),
        );
    }

    return exclusions && exclusions.length
        ? getRandomName(filteredListIncExclusions ?? [])
        : getRandomName(filteredList);
};

const getRandomName = (list: string[]) => list[Math.floor(Math.random() * list.length)];

const findIndexById = (name: string, members: GroupMember[]): number => {
    const NOT_FOUND = -1;
    for (let index = 0; index < members.length; index++) {
        if (members[index].name === name) {
            return index;
        }
    }

    return NOT_FOUND;
};

const createUrl = (
    member: GroupMember,
    assignedMember: GroupMember,
    currency?: string,
    budget?: string,
    date?: string,
): string => {
    const url: URL = new URL("https://spiel-secret-santa.herokuapp.com/getSecretSanta/");
    url.searchParams.append("name", member.name);
    url.searchParams.append("selected", encryptString(member.assignedTo));
    url.searchParams.append("currency", encryptString(currency ?? ""));
    url.searchParams.append("budget", encryptString(budget ?? ""));
    url.searchParams.append("date", encryptString(date ?? ""));

    for (const [key, value] of Object.entries(assignedMember)) {
        if (key === "wishlist") {
            url.searchParams.append("wishlist", encryptString(value));
        } else if (
            key !== "exclusions" &&
            key !== "inviteLink" &&
            key !== "assignedTo" &&
            key !== "_id" &&
            key !== "name"
        ) {
            url.searchParams.append(key, encodeString(value));
        }
    }

    return url.toString();
};

const encryptString = (stringToEncrypt: string): string => {
    return btoa(stringToEncrypt);
};

const encodeString = (stringToEncode: string | undefined): string => {
    return encodeURIComponent(stringToEncode ?? "");
};

const getFormattedDate = (date: string): string => {
    const dateObj = new Date(date);
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return `${month}/${day}/${year}`;
};

const getAllAvailableCurrency = (): string[] => [
    "US$",
    "€",
    "£",
    "A$",
    "C$",
    "S$",
    "₱",
    "Mex$",
    "₹",
    "NZ$",
    "RM",
    "lei",
    "CHF",
    "CLP$",
    "AED",
    "R",
    "COL$",
    "HK$",
    "S/",
    "₡",
    "E£",
    "kr",
    "Rp",
    "zł",
    "ARS$",
    "Ft",
    "₾",
    "₺",
    "Q",
    "₴",
    "RD$",
    "din",
    "LL",
    "฿",
    "B/.",
    "kn",
    "R$",
    "₽",
    "TT$",
    "¥",
    "ден",
    "L",
    "$U",
    "лв",
    "JD",
    "Kč",
    "NT$",
    "₩",
    "QR",
];

export {
    getListOfNames,
    findIndexById,
    createUrl,
    generateDraw,
    getFormattedDate,
    getAllAvailableCurrency,
};
