
import React, { Component } from 'react';
import { Text, View, ListView, Image, ScrollView, TouchableOpacity } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { loadPostsList } from '../../actions/posts';
import { getPostListByName } from '../../reducers/posts'

import styles from './style'
import CommentItem from '../../components/comment-item'
import Loading from '../../components/ui/loading'
import Nothing from '../../components/nothing'
import ListFooter from '../../components/ui/list-footer'
import RefreshControl from '../../components/ui/refresh-control'

import ListViewOnScroll from '../../common/list-view-onscroll'

class PostsList extends Component {

  constructor (props) {
    super(props)

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      loadMore: false,
      isRefreshing: false
    }
    this.goTo = this.goTo.bind(this)
    this.goToComment = this.goToComment.bind(this)
    this.loadPostsList = this.loadPostsList.bind(this)
    this.toPeople = this.toPeople.bind(this)
  }

  componentWillMount() {
    const { list } = this.props
    if (!list.data) this.loadPostsList()
  }

  toPeople(people) {
    const { navigate } = this.props.navigation;
    navigate('PeopleDetail', { title: people.nickname, id: people._id })
  }

  loadPostsList(callback, restart) {
    const { name, filters } = this.props
    this.props.loadPostsList({ name, filters, callback, restart })
  }

  goTo(posts){
    const { navigate } = this.props.navigation;
    // navigate('PostsDetail', { title: posts.title, id: '58b2850ed8831fe9027a5f92' })
    navigate('PostsDetail', { title: posts.title, id: posts._id })
  }

  goToComment(comment) {
    const { navigate } = this.props.navigation;
    navigate('CommentDetail', { title: comment.content_summary, id: comment._id })
  }

  renderHeader() {
    // return (<View><Text>发表</Text></View>)
  }

  render() {

    const self = this
    const { list } = this.props

    if (list.loading && list.data.length == 0 || !list.data) {
      return (<Loading />)
    }

    if (!list.loading && !list.more && list.data.length == 0) {
      return (<Nothing content="没有帖子" />)
    }

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let topics = ds.cloneWithRows(list.data || [])

    return (
        <ListView
          enableEmptySections={true}
          dataSource={topics}
          renderRow={(topic) => (<View style={styles.item}>

            <View style={styles.topicItem}>
              <TouchableOpacity onPress={()=>{this.goTo(topic)}}>
                <View>
                  <View style={styles.itemHead}>
                    <View>
                      <TouchableOpacity onPress={()=>{this.toPeople(topic.user_id)}}>
                        <Image source={{uri:'https:'+topic.user_id.avatar_url}} style={styles.avatar}  />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Text onPress={()=>{this.toPeople(topic.user_id)}} style={styles.nickname}>{topic.user_id.nickname}</Text>
                      <View style={styles.itemHeadOther}>
                        <Text style={styles.itemHeadOtherItem}>{topic.topic_id.name}</Text>
                        {topic.view_count ? <Text style={styles.itemHeadOtherItem}>{topic.view_count+'次浏览'}</Text> : null}
                        {topic.like_count ? <Text style={styles.itemHeadOtherItem}>{topic.like_count+'个赞'}</Text> : null}
                        {topic.follow_count ? <Text style={styles.itemHeadOtherItem}>{topic.follow_count+'人关注'}</Text> : null}
                      </View>
                    </View>
                  </View>
                  <View style={styles.itemMain}>
                    <Text style={styles.title}>{topic.title}</Text>
                    {topic.content_summary ? <Text style={styles.contentText}>{topic.content_summary}</Text> : null}
                    <View style={styles.flexContainer}>
                      {topic.images.map(img=>{
                        let _img = 'https:' + img.split('?')[0] + '?imageMogr2/auto-orient/thumbnail/!200/format/jpg'
                        return (<Image key={img} source={{uri:_img}} style={styles.images} />)
                      })}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {topic.comment && topic.comment.map(item=>{
                return (<View key={item._id}>
                  <TouchableOpacity onPress={()=>{this.goToComment(item)}}>
                    <CommentItem {...this.props} comment={item} displayEdit={false} canClick={false} />
                  </TouchableOpacity>
                </View>)
              })}

            {topic.comment && topic.comment_count > topic.comment.length ?
              <TouchableOpacity onPress={()=>{this.goTo(topic)}} style={styles.more}><Text>还有{topic.comment_count - topic.comment.length}条评论，查看全部</Text></TouchableOpacity>
              : null}

          </View>)}
          renderHeader={this.renderHeader}
          renderFooter={()=><ListFooter loading={list.loading} more={list.more} />}
          removeClippedSubviews={false}
          refreshControl={<RefreshControl onRefresh={callback=>self.loadPostsList(callback, true)} />}
          onScroll={ListViewOnScroll(self.loadPostsList)}
          scrollEventThrottle={50}
        />
    )
  }

}

export default connect((state, props) => ({
    // state: state，
    list: getPostListByName(state, props.name)
  }),
  (dispatch) => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)(PostsList)
