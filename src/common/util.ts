import type { GroupMember } from "./types";

const shuffleArray = (members: GroupMember[]): GroupMember[] => {
    const _members = [...members];
    for (let index = _members.length - 1; index > 0; index--) {
        const innerIndex = Math.floor(Math.random() * index);
        const temp = _members[index];
        _members[index] = _members[innerIndex];
        _members[innerIndex] = temp;
    }

    return _members;
};

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
    selectedMember: string,
    assignee: string,
    wishlist?: string,
): string => {
    return `${
        window.location.hostname
    }:3000/getSecretSanta/?name=${selectedMember}&selected=${encryptString(
        assignee,
    )}&wishlist=${wishlist !== undefined ? encryptString(wishlist) : ""}`;
};

const encryptString = (stringToEncrypt: string): string => {
    return btoa(stringToEncrypt);
};

export { shuffleArray, findIndexById, createUrl };
