var postData=require('../../data/posts-data.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A的执行，是在onLoad函数执行之后发生
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      posts_key: postData.postLists
    });
  },
  onPostTap: function (event){
    var postId=event.currentTarget.dataset.postid;
    console.log("onPost id is" + postId);
   wx.navigateTo({
     url: 'post-detail/post-detail?id='+postId,
   })
  }
})