import React from 'react';
import {connect} from 'react-redux';
import '../i18n';
import { withTranslation } from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';

import {MainMenus, SearchResult} from '../../core/constants';
import {ReduxHelpers} from '../../core/helpers';
import RecipeCrudModal from '../recipe-crud-modal/';
import SvgIcon from '../svgicon';
import {SET_SEARCH_QUERY} from '../../redux/actions/searchActions';
import CommitteeCrudModal from '../recipe-crud-modal/committee-crudal-modal';
import './style.scss';
import ApiCommittee from '../../core/api-committee';
import { isUndefined } from 'lodash';

const Mousetrap = require( 'mousetrap' );

class SidebarNotExtended extends React.Component {
    state = {
        recipeModalVisible: false,
        committeeModalVisible:false,
        id:undefined,
        committees:new ApiCommittee().getAllCommittees()
    };

    componentDidMount() {
        this.props.setTags();
        this.props.setCategories();
        this.setSelectedMenu( MainMenus[0], 'menu' );
        Mousetrap.bind( ['ctrl+n', 'command+n'], () => this.setState( { recipeModalVisible: true } ) );
    }

    componentWillUnmount() {
        Mousetrap.unbind( ['ctrl+n', 'command+n'] );
    }

    setSelectedMenu = ( item, type ) => {
        const { setSelectedMenu, setRecipeList, setQuery } = this.props;

        let letSelectedMenu = {};
        if ( 'tag' === type ) {
            letSelectedMenu = {
                slug: item,
                name: item,
                icon: 'tag',
                type
            };
        } else if ( 'category' === type ) {
            letSelectedMenu = {
                slug: item,
                name: item.charAt( 0 ).toUpperCase() + item.slice( 1 ),
                icon: 'meal',
                type
            };
        } else {
            letSelectedMenu = {
                ...item,
                type
            };
        }
        const selectedMenu = letSelectedMenu;

        setSelectedMenu( selectedMenu );
        setRecipeList( selectedMenu );
        setQuery( '' );
    };

    render() {
        const { t, tags, categories, selectedMenu, query } = this.props;
        const { recipeModalVisible } = this.state;
        const {committeeModalVisible,id} = this.state;

        return (
            <div className='comp_sidebar'>
                <RecipeCrudModal
                    show={recipeModalVisible}
                    committee_list = {categories}
                    onClose={() => this.setState({ recipeModalVisible: false })}
                />

                <CommitteeCrudModal
                    show={committeeModalVisible}
                    id = {id}
                    onClose={() => this.setState({ committeeModalVisible: false,id:undefined })}
                />




                

                <div className='header'>
                    <div onClick={() => this.setState({ recipeModalVisible: true })}
                         className='new-recipe-container'>
                        <div className='text'>{ t( 'New Meeting' ) }</div>
                        <div className='plus'>+</div>
                    </div>
                    <div onClick={() => this.setState({ committeeModalVisible: true,id:undefined })}
                         className='new-recipe-container'>
                        <div className='text'>{ t( 'New Committee' ) }</div>
                        <div className='plus'>+</div>
                    </div>

                    {
                        '' !== query ?
                            (
                                <div className='search-result-container'>
                                    <ul className='menu-list'>
                                        <li className={`menu-list-item ${selectedMenu.slug === SearchResult.slug ? 'active' : ''}`}>
                                            <div className='icon-container'>
                                                <SvgIcon name={SearchResult.icon}/>
                                            </div>
                                            <div className='others-container'>
                                                <div className='text-container'>{SearchResult.name}</div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            )
                            : null
                    }

                    <div className='main-menu-container'>
                        <div className='sidebar-title'>{ t( 'Main menu' ) }</div>
                        <ul className='menu-list'>
                            {
                                MainMenus.map( ( value, index ) => {
                                    let containerClassName = 'menu-list-item';
                                    if ( value.slug === selectedMenu.slug ) {
                                        containerClassName += ' active';
                                    }

                                    return (
                                        <li key={index} onClick={() => this.setSelectedMenu( value, 'menu' )}
                                            className={containerClassName}>
                                            <div className='icon-container'>
                                                <SvgIcon name={value.icon}/>
                                            </div>
                                            <div className='others-container'>
                                                <div className='text-container'>{ t( value.name ) }</div>
                                            </div>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </div>
                <input type='checkbox' className='accordion__checkbox' id='accordion-tags' />
                <label className='sidebar-title accordion__heading' htmlFor='accordion-tags'>{ t( 'Tags' ) }</label>
                <div className='tags-wrapper accordion'>
                    <div className='tags-container accordion__content'>
                        {
                            0 === tags.length ?
                                <div className='no-item-text'>{ t( 'There isn\'t any tag yet' ) }</div>
                                : (
                                    <ul className='menu-list'>
                                        {
                                            tags.map( ( value, index ) => {
                                                let containerClassName = 'menu-list-item';
                                                if ( value === selectedMenu.slug ) {
                                                    containerClassName += ' active';
                                                }

                                                return (
                                                    <li key={index} onClick={() => this.setSelectedMenu( value, 'tag' )}
                                                        className={containerClassName}>
                                                        <div className='icon-container'>
                                                            <SvgIcon name={'tag'}/>
                                                        </div>
                                                        <div className='others-container'>
                                                            <div className='text-container'>{value}</div>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                )
                        }
                    </div>
                </div>
                <input type='checkbox' className='accordion__checkbox' id='accordion-categories' />
                <label className='sidebar-title accordion__heading' htmlFor='accordion-categories'>{ t( 'Comittees' ) }</label>
                <div className='categories-wrapper accordion'>
                    <div className='categories-container accordion__content'>
                        {
                            0 === categories.length ?
                                <div className='no-item-text'>{ t( 'There isn\'t any categorized comittee yet' ) }</div>
                                : (
                                    <ul className='menu-list'>
                                        {
                                            categories.map( ( value, index ) => {
                                                let containerClassName = 'menu-list-item';
                                                if ( value === selectedMenu.slug ) {
                                                    containerClassName += ' active';
                                                }

                                                return (
                                                    <li key={index} onClick={() => this.setSelectedMenu( value, 'category' )}
                                                        className={containerClassName}>
                                                        <div className='icon-container'>
                                                            <SvgIcon name={'servings'}/>
                                                        </div>
                                                        <div className='others-container'>
                                                            <div className='text-container'>{value.charAt( 0 ).toUpperCase() + value.slice( 1 )}</div>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                )
                        }
                    </div>
                </div>
                <input type='checkbox' className='accordion__checkbox' id='accordion-categories1' />
                <label className='sidebar-title accordion__heading' htmlFor='accordion-categories1'>{ t( 'Edit Comittees' ) }</label>
                <div className='categories-wrapper accordion'>
                    <div className='categories-container accordion__content'>
                        {
                            0 === this.state.committees.length ?
                                <div className='no-item-text'>{ t( 'There isn\'t any categorized comittee yet' ) }</div>
                                : (
                                    <ul className='menu-list'>
                                        {
                                            this.state.committees.map( ( value, index ) => {
                                                let containerClassName = 'menu-list-item';
                                                if ( value === selectedMenu.slug ) {
                                                    containerClassName += ' active';
                                                }

                                                return (
                                                    <li key={index} onClick={() => this.setState( {id:new ApiCommittee().getCommitteeByTitle(value).id, committeeModalVisible:true })}
                                                        className={containerClassName}>
                                                        <div className='icon-container'>
                                                            <SvgIcon name={'servings'}/>
                                                        </div>
                                                        <div className='others-container'>
                                                            <div className='text-container'>{value.charAt( 0 ).toUpperCase() + value.slice( 1 )}</div>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                )
                        }
                    </div>
                </div>

                



            </div>
        );
    }
}

const mapStateToProps = state => {
    const { tags, categories, selectedMenu } = state.sidebar;
    const { query } = state.search;
    return { tags, categories, selectedMenu, query };
};

const mapDispatchToProps = ( dispatch ) => {
    return {
        setSelectedMenu: selectedMenu => ReduxHelpers.setSelectedMenu( dispatch, selectedMenu ),
        setTags: () => ReduxHelpers.fillTags( dispatch ),
        setCategories: () => ReduxHelpers.fillCategories( dispatch ),
        setRecipeList: selectedMenu => ReduxHelpers.fillRecipes( dispatch, selectedMenu ),
        setQuery: query => dispatch({ type: SET_SEARCH_QUERY, payload: query })
    };
};

const Sidebar = hoistStatics( withTranslation()( SidebarNotExtended ), SidebarNotExtended );

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
