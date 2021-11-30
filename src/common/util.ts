import type { GroupMember } from "./types";

const getListOfNames = (members: GroupMember[]): string[] => {
    return members.reduce((acc: string[], member) => [...acc, member.name], []);
}

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
    const wishlistString = assignedMember.wishlist ? encryptString(assignedMember.wishlist) : "";
    const budgetString = budget ? encryptString(budget) : "";
    const currencyString = currency ? encryptString(currency) : "";
    const noteString = assignedMember.notes ? encryptString(assignedMember.notes) : "";
    const dateString = date ? encryptString(date) : "";

    return `${window.location.hostname}:3000/getSecretSanta/?name=${member.name}&selected=${encryptString(assignedMember.name,
    )}&wishlist=${wishlistString}&budget=${budgetString}&currency=${currencyString}&notes=${noteString}&date=${dateString}`;
};

const encryptString = (stringToEncrypt: string): string => {
    return btoa(stringToEncrypt);
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
    getAllAvailableCurrency,
};
