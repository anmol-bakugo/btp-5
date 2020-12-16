import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';

import {StorageHelpers} from './helpers';
import {App} from './constants';

let db;

class ApiCommittee {
    constructor() {
        const dbFilePath = path.join( StorageHelpers.preference.get( 'storagePath' ), App.dbName );
        const adapter = new FileSync( dbFilePath );
        db = lowdb( adapter );
        db.defaults( { committee: [] } ).write();
        
    }

    addNewCommitteeItem = item => db.get( 'committee' ).push( item ).write();

    updateCommitteeItem = obj => db.get( 'committee' ).find( { id: obj.id } ).assign( obj ).write();

    deleteCommitteeById = id => db.get( 'committee' ).remove( { id } ).write();

    getCommitteeById = id => db.get( 'committee' ).find( { id } ).value();

    getAllCommittees = () => db.get( 'committee' ).map( 'title' ).value();
    getCommitteeByTitle = title => db.get( 'committee' ).find( { title } ).value();

    getAllCommitteesInTrash = () => db.get( 'committee' ).filter( { isTrash: true } ).value();

    getAllUntaggedCommittees = () => db.get( 'committee' ).filter( { tags: '', isTrash: false } || {
        tags: null,
        isTrash: false
    }).value();

    getAllUncategorizedCommittees = () => db.get( 'committee' ).filter( { categories: '', isTrash: false } || {
        categories: null,
        isTrash: false
    }).value();

    getAllFavoriteCommittees = () => db.get( 'committee' ).filter( { isfavorite: true, isTrash: false } ).sortBy( 'title' ).value();

    getAllTags = () => db.get( 'committee' ).filter( { isTrash: false } ).map( 'tags' ).value();

    getCommitteesContainsTag = tag => db.get( 'committee' ).filter( ( t => t.tags.indexOf( tag ) > -1 && false === t.isTrash ) ).value();

    getAllCategories = () => db.get( 'committee' ).filter( { isTrash: false } ).map( 'categories' ).value();

    getCommitteesContainsCategory = category => db.get( 'committee' ).filter( ( t => t.categories.indexOf( category ) > -1 && false === t.isTrash ) ).value();

    queryCommittee = query => db.get( 'committee' ).filter( ( t => ( t.title.toLowerCase().indexOf( query ) > -1 ) && false === t.isTrash ) ).value();
}

export default ApiCommittee;
