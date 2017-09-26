
import React, { PureComponent } from 'react'
import { AsyncStorage } from 'react-native'
import Dimensions from 'Dimensions'

import { loadUserInfo, addAccessToken, cleanUserInfo } from './actions/user'
import { cleanAllNotification } from './actions/notification'
import { cleanAllPosts } from './actions/posts'
import { cleanAllComment } from './actions/comment'
import { cleanAllFollow } from './actions/follow'
import { cleanAllPeople } from './actions/people'
import { cleanAllTopic } from './actions/topic'
import { checkClientInstalled } from './actions/client-installed'

export default ({ dispatch, getState }) => {

  global.screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }

  // 清空redux的所有数据
  global.cleanRedux = () => {
    cleanUserInfo()(dispatch, getState)
    cleanAllPosts()(dispatch, getState)
    cleanAllComment()(dispatch, getState)
    cleanAllNotification()(dispatch, getState)
    cleanAllFollow()(dispatch, getState)
    cleanAllPeople()(dispatch, getState)
    cleanAllTopic()(dispatch, getState)
  }

  // 初始化redux数据
  global.initReduxDate = (callback) => {

    // 清空之前的数据
    global.cleanRedux()

    // 检测是否安装了某些客户端
    checkClientInstalled()(dispatch, getState)

    // 如果存在token，那么检测token，是否有效
    AsyncStorage.getItem('token', (errs, result)=>{

      if (!result) return callback(false)

      loadUserInfo({
        accessToken: result,
        callback: (res)=>{

          if (res && res.success) {
            // 正常登陆
            addAccessToken({ accessToken: result })(dispatch, getState)
            callback(res.data)
          } else if (res && !res.success) {
            // token失效
            AsyncStorage.removeItem('token',(res)=>{
              callback(false)
            })
          } else {
            // api
            callback(false)
          }

        }
      })(dispatch, getState)

    })

  }

}