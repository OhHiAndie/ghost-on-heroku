'use strict';

$(document).ready(function() {

  // ========================
  // Prevent FOUC of content
  // ========================

  $('.no-fouc').removeClass('no-fouc');

  // =================
  // Responsive videos
  // =================

  $('.wrapper').fitVids();

  // ===============
  // Off Canvas menu
  // ===============

  $('.off-canvas-toggle').click(function(e) {
    e.preventDefault();
    $('.off-canvas-container').toggleClass('is-active');
  });

  // ======
  // Search
  // ======

  var search_field = $('.search-form__field'),
      search_results = $('.search-results'),
      toggle_search = $('.toggle-search-button'),
      close_search = $('.close-search-button'),
      search_result_template = "\
        <div class='search-results__item'>\
          <a class='search-results__item__title' href='{{link}}'>{{title}}</a>\
          <span class='post__date'>{{pubDate}}</span>\
        </div>";

  toggle_search.click(function(e) {
    e.preventDefault();
    $('.search-form-container').addClass('is-active');

    // If off-canvas is active, just disable it
    $('.off-canvas-container').removeClass('is-active');

    setTimeout(function() {
      search_field.focus()
    }, 500);
  });

  $('.search-form-container, .close-search-button').on('click keyup', function(event) {
    if (event.target == this || event.target.className == 'close-search-button' || event.keyCode == 27) {
      $('.search-form-container').removeClass('is-active');
    }
  });

  search_field.ghostHunter({
    results: search_results,
    onKeyUp         : true,
    info_template   : "<h4 class='heading'>Number of posts found: {{amount}}</h4>",
    result_template : search_result_template,
    zeroResultsInfo : false,
    before: function() {
      search_results.fadeIn();
    }
  });

  // =================================================
  // Add class 'current' to current page in navigation
  // =================================================

  $('.site-header__navigation a').each(function() {
    if($(this).attr('href') == window.location.href) {
      $(this).addClass('current');
    }
  });

  // ===============
  // Homepage Layout
  // ===============

  // Add large-6 to second and third posts in homepage, so each one will be 50% width
  $('.home-template .post-card-wrap:nth-of-type(2), .home-template .post-card-wrap:nth-of-type(3)')
  .addClass('medium-6 large-6');

  // Add `regular` class to the second and third posts titles in homepage
  // so it will look more much bigger related to it's 50% width
  $('.home-template .post-card').slice(0, 3).each(function() {
    $(this).find('.post-card__title').addClass('regular');
  });

  // =============
  // Related posts
  // =============

  var related_post_template = "\
      <article class='post-card-wrap column medium-4 large-4'>\
        <div class='post-card post-card--less-space'>\
          <a href='{url}'>\
            <div class='post-card__image CoverImage FlexEmbed FlexEmbed--16by9 grey-bg' style='background-image: url({image})''>\
            </div>\
          </a>\
            <h2 class='post-card__title post-card__title--small'>\
              <a itemprop='headline' href='{url}'>{title}</a>\
            </h2>\
        </div>\
      </article>";

  $('.related-posts').ghostRelated({
    feed: '/rss',
    titleClass: '.post__title',
    tagsClass: '.post__tags',
    template: related_post_template,
    debug: false,
    limit: 3
  });

  // ============
  // Latest posts
  // ============

  function latestPosts() {
    $.get('/rss/', function (data) {
      var $xml = $(data);
      var recent = '';
      $xml.find('item').slice(0, 4).each(function () {
        var $this = $(this),
        item = {
          title: $this.find('title').text(),
          link: $this.find('link').text(),
          image: $this.find('media\\:content, content').attr('url'),
          description: $this.find('description').text(),
          pubDate: $this.find('pubDate').text(),
          category: $this.find('category').text()
        };
        recent += '<div class="post-card">';
        recent += '<a title="' + item.title + '" href="' + item.link + '">';
        recent += '<div style="background-image: url(' + item.image + ')" class="grey-bg post-card__image post-card__image--has-outline CoverImage FlexEmbed FlexEmbed--4by3"></div>';
        recent += '</a>';
        recent += '<h2 class="post-card__title post-card__title--small">';
        recent += '<a title="' + item.title + '" href="' + item.link + '">' + item.title + '</a>';
        recent += '</h2>';
        recent += '</div>';
      });
      $('.recent-posts').html(recent);
    });
  }

  latestPosts();

  // ==============
  // Twitter widget
  // ==============

  var twitterWidget = true;         // Set to false to hide the Twitter widget
  var twitterWidgetID = '488095150267039744'; // ID of your Twitter widget

  if (twitterWidget && $('#twitter-widget').length) {
    var twitterConfig = {
      'id': twitterWidgetID,
      'domId': 'twitter-widget',
      'maxTweets': 2,
      'enableLinks': true,
      'showUser': false,
      'showInteraction': false
    };
    twitterFetcher.fetch(twitterConfig);
  } else {
    $('.widget--twitter-wrap').remove();
  }

  // ====================
  // When document loaded
  // ====================

  $(window).load(function() {
    // If no related-posts found, remove the `related-posts` container
    // Used setTimeout, just to make sure that the rss is parsed correctly
    setTimeout(function() {
      if (!$('.related-posts article').length) {
       $('.related-posts').remove();
     }
    }, 500);
  });

});