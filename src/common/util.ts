/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GroupPayload } from "../features/home/components/CreateGroup";
import type { SelectedForm } from "../types/FormTypes";
import type { GroupMember } from "./types";

const getListOfNames = (members: GroupMember[]): string[] => {
    return members.map((member) => member.name);
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
            const assignedTo = pickAName(name, listRemaining, currentMember.exclusions);
            listRemaining = remove(assignedTo, listRemaining);
            return [...acc, { ...currentMember, name, assignedTo }];
        }
        return acc;
    }, []);

    // If some members in group were not assigned a name, try again
    if (result.some(({ assignedTo }) => !assignedTo)) {
        return generateDraw(
            namesInHat,
            namesInHat,
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

    if (exclusions && exclusions.length) {
        return getRandomName(filteredList.filter((name) => !exclusions.includes(name)));
    }

    return getRandomName(filteredList);
};

const getRandomName = (list: string[]) => list[Math.floor(Math.random() * list.length)];

const findByName = (name: string, members: GroupMember[]): GroupMember | undefined => {
    return members.find((member) => member.name === name);
};

const findMemberIndex = (name: string, members: GroupMember[]): number => {
    return members.findIndex((member) => member.name === name);
};

const createUrl = (
    member: GroupMember,
    assignedMember: GroupMember,
    groupData: GroupPayload,
    formType: SelectedForm,
): string => {
    const url: URL = new URL("https://spiel-secret-santa.vercel.app/getSecretSanta/");
    url.searchParams.append("selected", encryptString(member.assignedTo));
    url.searchParams.append("currency", encryptString(groupData.currency));
    url.searchParams.append("budget", encryptString(groupData.budget));
    url.searchParams.append("date", encryptString(groupData.date));
    url.searchParams.append("formType", encryptString(formType));
    url.searchParams.append("id", member.id);
    url.searchParams.append("name", member.name);
    url.searchParams.append("groupId", member.groupId ?? "");

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
    findByName,
    findMemberIndex,
    createUrl,
    generateDraw,
    getFormattedDate,
    getAllAvailableCurrency,
    encryptString,
};
