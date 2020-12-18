const MainMenus = [
    {
        slug: 'all_recipes',
        icon: 'meetings',
        name: 'All Meetings',
        type: 'menu'
    },
    {
        slug: 'favorites',
        icon: 'bookmark_outline',
        name: 'Favorites',
        type: 'menu'
    },
    {
        slug: 'untagged',
        icon: 'ghost',
        name: 'Untagged',
        type: 'menu'
    },
    {
        slug: 'trash',
        icon: 'trash',
        name: 'Trash',
        type: 'menu'
    }
];

const SearchResult = {
    slug: 'search_result',
    icon: 'search',
    name: 'Search result',
    type: 'search'
};

const TagsResult = {
    slug: 'tags',
    type: 'tags'
};

const CategoriesResult = {
    slug: 'categories',
    type: 'categories'
};

const Keys = {
    enter: 13,
    tab: 9,
    backspace: 8,
    upArrow: 38,
    downArrow: 40,
    escape: 27
};

const App = {
    name: 'officeJournal',
    folderName: 'birdskitchen',
    backupFolderName: 'backups',
    dbName: 'officejournal.db'
};

export { MainMenus, Keys, SearchResult, TagsResult, CategoriesResult, App };
