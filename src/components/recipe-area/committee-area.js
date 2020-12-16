import React from 'react';
import {connect} from 'react-redux';

import ContentHeader from '../content-header';
import RecipeList from '../recipe-list';
import CommitteeList from '../recipe-list';

import './style.scss';

class CommitteeArea extends React.Component {
    render() {
        const { selectedMenu, committees } = this.props;

        return (
            <div className='comp_recipe-area'>
                {/* <div className='header-container'>
                    <ContentHeader
                        title={selectedMenu?.name}
                        itemLength={recipes.length}
                        icon={selectedMenu?.icon}
                    />
                </div> */}
                <div className='body-container'>
                    <CommitteeList
                        items={committees}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { selectedMenu } = state.sidebar;
    const { committees } = state.recipe;
    return { selectedMenu, committees };
};

export default connect( mapStateToProps )( CommitteeArea );
