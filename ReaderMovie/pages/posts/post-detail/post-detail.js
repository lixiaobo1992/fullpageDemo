var postsData = require('../../../data/posts-data.js');
var app=getApp();
Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function (options) {
  //  var globalData=app.globalData;
    //console.log("11");
    var postId = options.id;
    this.data.currentPostId = postId;
    //console.log(postId);
    var postData = postsData.postLists[postId];
    // console.log(postData);
    // this.data.postData = postData;
    this.setData({
      postData: postData
    })
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
      //this.data.isPlayingMusic=true;
      this.setData({
        isPlayingMusic: true
      })
    }
      this.setMusicMonitor();
  },
  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic=true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId =null;
    })
  },
  onCollectionTap: function (event) {
    console.log("222");
    //  this.getPostsCollectedAsy();
    this.getPostsCollectedSyc();
  },
  getPostsCollectedAsy: function () {
    var that = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        //收藏变未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showModal(postsCollected, postCollected);
      },
    })
  },
  getPostsCollectedSyc: function () {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showModal(postsCollected, postCollected);
  },
  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
      showCancel: "true",
      cancelText: "不收藏",
      cancelColor: "#333",
      confirmText: "收藏",
      confirmColor: "#405f80",
      success: function (res) {
        if (res.confirm) {
          //更新文章是否的缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          //更新数据绑定变量，从而实现切换图片
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  showToast: function (postsCollected, postCollected) {
    var that = this;
    //更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 2000,
      icon: "success"
    })
  },
  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        //res.cancel
        //res.tapIndex
        wx.showModal({
          title: "用户分享到了" + itemList[res.tapIndex],
          content: "用户是否取消" + res.cancel + "现在无法实现分享功能，什么时候支持了"
        })
      }
    })
  },
  onMusicTap: function (event) {
    var currentPostId = this.data.currentPostId;
   // console.log(currentPostId);
    var postData = postsData.postLists[currentPostId];
    console.log("postData=====>"+postData);
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic:false
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.tutle, 
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      });
    }
  }
});