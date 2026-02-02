// // Get all video items
// const videoItems = document.querySelectorAll("[data-v-item]");

// // Loop through each item and set the iframe src
// videoItems.forEach((item) => {
//   const vimeoId = item.getAttribute("data-v-id");
//   const iframe = item.querySelector(".c-vimeo-player-iframe");

//   if (vimeoId && iframe) {
//     // Check data-v-audio attribute to determine initial muted state
//     const audioAttribute = item.getAttribute("data-v-audio");
//     const mutedValue = audioAttribute === "playing" ? 0 : 1;

//     const videoLink = `https://player.vimeo.com/video/${vimeoId}?api=1&background=1&autoplay=0&loop=0&muted=${mutedValue}`;
//     iframe.src = videoLink;

//     // Initialize Vimeo Player for size control
//     const vimeoInstance = new Vimeo.Player(iframe);
//     const sizeAttribute = item.getAttribute("data-v-size");

//     // Feature 1: Set data-v-ready to true when video is loaded
//     vimeoInstance.on("loaded", function () {
//       item.setAttribute("data-v-ready", "true");

//       // Set total duration on load
//       vimeoInstance.getDuration().then(function (duration) {
//         const totalTimeElement = item.querySelector("[data-v-time='total']");
//         if (totalTimeElement) {
//           totalTimeElement.textContent = formatTime(duration);
//         }
//       });

//       // Feature 5: Autoplay if data-v-autoplay is true
//       const autoplayAttribute = item.getAttribute("data-v-autoplay");
//       if (autoplayAttribute === "true") {
//         vimeoInstance
//           .play()
//           .then(function () {
//             item.setAttribute("data-v-playing", "true");
//           })
//           .catch(function (error) {
//             console.error("Autoplay failed:", error);
//           });
//       }
//     });

//     // Loop functionality - handle video end
//     vimeoInstance.on("ended", function () {
//       const loopAttribute = item.getAttribute("data-v-loop");

//       if (loopAttribute === "true" || loopAttribute === "restart-and-play") {
//         // Restart and play again
//         vimeoInstance.setCurrentTime(0).then(function () {
//           vimeoInstance.play().then(function () {
//             item.setAttribute("data-v-playing", "true");
//           });
//         });
//       } else if (loopAttribute === "restart-and-pause") {
//         // Restart and pause
//         vimeoInstance.setCurrentTime(0).then(function () {
//           vimeoInstance.pause().then(function () {
//             item.setAttribute("data-v-playing", "false");
//           });
//         });
//       } else {
//         // No loop - just update playing state
//         item.setAttribute("data-v-playing", "false");
//       }
//     });

//     // Update current time dynamically
//     let isUserDragging = false;

//     vimeoInstance.on("timeupdate", function (data) {
//       const currentTimeElement = item.querySelector("[data-v-time='current']");
//       if (currentTimeElement) {
//         currentTimeElement.textContent = formatTime(data.seconds);
//       }

//       // Update progress timeline and input (only if not currently being dragged by user)
//       const inputElement = item.querySelector("[data-v-tl='input']");
//       const progressElement = item.querySelector("[data-v-tl='progress']");
//       const percentage = (data.seconds / data.duration) * 100;

//       if (progressElement) {
//         progressElement.value = percentage;
//         progressElement.setAttribute("max", "100");
//       }

//       // Update input value if user is not actively dragging it
//       if (inputElement && !isUserDragging) {
//         inputElement.value = percentage;
//       }
//     });

//     // Timeline seek input
//     const inputElement = item.querySelector("[data-v-tl='input']");
//     if (inputElement) {
//       // Set initial attributes
//       inputElement.setAttribute("min", "0");
//       inputElement.setAttribute("max", "100");
//       inputElement.setAttribute("step", "0.01");
//       inputElement.value = "0";

//       let wasPlaying = false;
//       let isDragging = false;

//       // Start dragging
//       inputElement.addEventListener("mousedown", function () {
//         isDragging = true;
//         isUserDragging = true;
//         wasPlaying = item.getAttribute("data-v-playing") === "true";
//       });

//       inputElement.addEventListener("touchstart", function () {
//         isDragging = true;
//         isUserDragging = true;
//         wasPlaying = item.getAttribute("data-v-playing") === "true";
//       });

//       // During input (dragging or clicking)
//       inputElement.addEventListener("input", function (e) {
//         e.stopPropagation();
//         const percentage = parseFloat(this.value);

//         vimeoInstance.getDuration().then(function (duration) {
//           const seekTime = (percentage / 100) * duration;
//           vimeoInstance.setCurrentTime(seekTime);
//         });
//       });

//       // End dragging
//       inputElement.addEventListener("mouseup", function () {
//         if (isDragging) {
//           const percentage = parseFloat(this.value);

//           vimeoInstance.getDuration().then(function (duration) {
//             const seekTime = (percentage / 100) * duration;
//             vimeoInstance.setCurrentTime(seekTime).then(function () {
//               // Always play after seeking is complete
//               if (wasPlaying) {
//                 vimeoInstance.play().then(function () {
//                   item.setAttribute("data-v-playing", "true");
//                 });
//               }
//             });
//           });
//         }
//         isDragging = false;
//         isUserDragging = false;
//       });

//       inputElement.addEventListener("touchend", function () {
//         if (isDragging) {
//           const percentage = parseFloat(this.value);

//           vimeoInstance.getDuration().then(function (duration) {
//             const seekTime = (percentage / 100) * duration;
//             vimeoInstance.setCurrentTime(seekTime).then(function () {
//               // Always play after seeking is complete
//               if (wasPlaying) {
//                 vimeoInstance.play().then(function () {
//                   item.setAttribute("data-v-playing", "true");
//                 });
//               }
//             });
//           });
//         }
//         isDragging = false;
//         isUserDragging = false;
//       });

//       // Handle case where user drags outside
//       document.addEventListener("mouseup", function () {
//         if (isDragging && wasPlaying) {
//           vimeoInstance.play().then(function () {
//             item.setAttribute("data-v-playing", "true");
//           });
//         }
//         isDragging = false;
//         isUserDragging = false;
//       });
//     }

//     // Helper function to format time (seconds to MM:SS or HH:MM:SS)
//     function formatTime(seconds) {
//       const hours = Math.floor(seconds / 3600);
//       const minutes = Math.floor((seconds % 3600) / 60);
//       const secs = Math.floor(seconds % 60);

//       if (hours > 0) {
//         return `${hours}:${padZero(minutes)}:${padZero(secs)}`;
//       } else {
//         return `${minutes}:${padZero(secs)}`;
//       }
//     }

//     function padZero(num) {
//       return num.toString().padStart(2, "0");
//     }

//     // Feature 2: Play/Pause on item click
//     item.addEventListener("click", function (e) {
//       // Don't trigger if clicking on any control element
//       const controlElement = e.target.closest("[data-v-controls]");
//       if (controlElement) {
//         return;
//       }

//       const isPlaying = item.getAttribute("data-v-playing") === "true";

//       if (isPlaying) {
//         vimeoInstance.pause().then(function () {
//           item.setAttribute("data-v-playing", "false");
//         });
//       } else {
//         vimeoInstance.play().then(function () {
//           item.setAttribute("data-v-playing", "true");
//         });
//       }
//     });

//     // Feature 3: Audio control based on data-v-audio attribute
//     const audioObserver = new MutationObserver(function (mutations) {
//       mutations.forEach(function (mutation) {
//         if (
//           mutation.type === "attributes" &&
//           mutation.attributeName === "data-v-audio"
//         ) {
//           const audioAttribute = item.getAttribute("data-v-audio");
//           if (audioAttribute === "playing") {
//             vimeoInstance.setVolume(1).then(function () {
//               vimeoInstance.setMuted(false);
//             });
//           } else if (audioAttribute === "muted") {
//             vimeoInstance.setMuted(true);
//           }
//         }
//       });
//     });

//     // Start observing the item for audio attribute changes
//     audioObserver.observe(item, {
//       attributes: true,
//       attributeFilter: ["data-v-audio"],
//     });

//     // Feature 4: Play control
//     const playControl = item.querySelector("[data-v-controls='play']");
//     if (playControl) {
//       playControl.addEventListener("click", function (e) {
//         e.stopPropagation();
//         vimeoInstance.play().then(function () {
//           item.setAttribute("data-v-playing", "true");
//         });
//       });
//     }

//     // Feature 4: Pause control
//     const pauseControl = item.querySelector("[data-v-controls='pause']");
//     if (pauseControl) {
//       pauseControl.addEventListener("click", function (e) {
//         e.stopPropagation();
//         vimeoInstance.pause().then(function () {
//           item.setAttribute("data-v-playing", "false");
//         });
//       });
//     }

//     // Feature 4: Mute control
//     const muteControl = item.querySelector("[data-v-controls='mute']");
//     if (muteControl) {
//       muteControl.addEventListener("click", function (e) {
//         e.stopPropagation();
//         vimeoInstance.setMuted(true).then(function () {
//           item.setAttribute("data-v-audio", "muted");
//         });
//       });
//     }

//     // Feature 4: Unmute control
//     const unmuteControl = item.querySelector("[data-v-controls='unmute']");
//     if (unmuteControl) {
//       unmuteControl.addEventListener("click", function (e) {
//         e.stopPropagation();
//         vimeoInstance.setVolume(1).then(function () {
//           vimeoInstance.setMuted(false).then(function () {
//             item.setAttribute("data-v-audio", "playing");
//           });
//         });
//       });
//     }

//     // Feature 4: Fullscreen control
//     const fullscreenControl = item.querySelector(
//       "[data-v-controls='fullscreen']",
//     );

//     if (fullscreenControl) {
//       fullscreenControl.addEventListener("click", function (e) {
//         e.stopPropagation(); // Prevent triggering play/pause

//         const isFullscreen = item.getAttribute("data-v-fullscreen") === "true";

//         if (!isFullscreen) {
//           // Enter fullscreen
//           if (item.requestFullscreen) {
//             item.requestFullscreen();
//           } else if (item.webkitRequestFullscreen) {
//             item.webkitRequestFullscreen();
//           } else if (item.mozRequestFullScreen) {
//             item.mozRequestFullScreen();
//           } else if (item.msRequestFullscreen) {
//             item.msRequestFullscreen();
//           }
//           item.setAttribute("data-v-fullscreen", "true");
//         } else {
//           // Exit fullscreen
//           if (document.exitFullscreen) {
//             document.exitFullscreen();
//           } else if (document.webkitExitFullscreen) {
//             document.webkitExitFullscreen();
//           } else if (document.mozCancelFullScreen) {
//             document.mozCancelFullScreen();
//           } else if (document.msExitFullscreen) {
//             document.msExitFullscreen();
//           }
//           item.setAttribute("data-v-fullscreen", "false");
//         }
//       });
//     }

//     // Handle ESC key and fullscreen change events
//     document.addEventListener("fullscreenchange", function () {
//       if (!document.fullscreenElement) {
//         item.setAttribute("data-v-fullscreen", "false");
//       }
//     });

//     document.addEventListener("webkitfullscreenchange", function () {
//       if (!document.webkitFullscreenElement) {
//         item.setAttribute("data-v-fullscreen", "false");
//       }
//     });

//     document.addEventListener("mozfullscreenchange", function () {
//       if (!document.mozFullScreenElement) {
//         item.setAttribute("data-v-fullscreen", "false");
//       }
//     });

//     document.addEventListener("msfullscreenchange", function () {
//       if (!document.msFullscreenElement) {
//         item.setAttribute("data-v-fullscreen", "false");
//       }
//     });

//     // Handle default size videos
//     if (sizeAttribute === "default") {
//       // Get video dimensions and set aspect ratio
//       vimeoInstance.getVideoWidth().then(function (videoWidth) {
//         vimeoInstance.getVideoHeight().then(function (videoHeight) {
//           const aspectRatio = (videoHeight / videoWidth) * 100;
//           // Update padding-top on the height element
//           const sizeElement = item.querySelector(".c-vimeo-player-height");
//           if (sizeElement) {
//             sizeElement.style.paddingTop = aspectRatio + "%";
//           }
//         });
//       });
//     }

//     // Handle full size videos
//     if (sizeAttribute === "full") {
//       let aspectRatio;
//       // Get video dimensions
//       vimeoInstance.getVideoWidth().then(function (videoWidth) {
//         vimeoInstance.getVideoHeight().then(function (videoHeight) {
//           aspectRatio = videoHeight / videoWidth;
//           // Remove padding from height element
//           const sizeElement = item.querySelector(".c-vimeo-player-height");
//           if (sizeElement) {
//             sizeElement.style.paddingTop = "0%";
//           }
//           // Initial sizing
//           resizeVideo();
//         });
//       });

//       // Function to adjust video sizing (to cover the container)
//       function resizeVideo() {
//         const containerAspect = item.offsetHeight / item.offsetWidth;
//         if (iframe && aspectRatio) {
//           if (containerAspect > aspectRatio) {
//             // Container is taller relative to the video
//             const scaleFactor = containerAspect / aspectRatio;
//             iframe.style.width = scaleFactor * 100 + "%";
//             iframe.style.height = "100%";
//           } else {
//             // Container is wider relative to the video
//             const scaleFactor = aspectRatio / containerAspect;
//             iframe.style.height = scaleFactor * 100 + "%";
//             iframe.style.width = "100%";
//           }
//         }
//       }

//       // Adjust video sizing on window resize
//       window.addEventListener("resize", resizeVideo);
//     }
//   }
// });

// Get all video items
const videoItems = document.querySelectorAll("[data-v-item]");

// Loop through each item and set the iframe src
videoItems.forEach((item) => {
  const vimeoId = item.getAttribute("data-v-id");
  const iframe = item.querySelector(".c-vimeo-player-iframe");

  if (vimeoId && iframe) {
    // Check data-v-audio attribute to determine initial muted state
    const audioAttribute = item.getAttribute("data-v-audio");
    const mutedValue = audioAttribute === "playing" ? 0 : 1;

    const videoLink = `https://player.vimeo.com/video/${vimeoId}?api=1&background=1&autoplay=0&loop=0&muted=${mutedValue}`;
    iframe.src = videoLink;

    // Initialize Vimeo Player for size control
    const vimeoInstance = new Vimeo.Player(iframe);
    const sizeAttribute = item.getAttribute("data-v-size");

    // Feature 1: Set data-v-ready to true when video is loaded
    vimeoInstance.on("loaded", function () {
      item.setAttribute("data-v-ready", "true");

      // Set total duration on load
      vimeoInstance.getDuration().then(function (duration) {
        const totalTimeElement = item.querySelector("[data-v-time='total']");
        if (totalTimeElement) {
          totalTimeElement.textContent = formatTime(duration);
        }
      });

      // Feature 5: Autoplay if data-v-autoplay is true
      const autoplayAttribute = item.getAttribute("data-v-autoplay");
      if (autoplayAttribute === "true") {
        vimeoInstance
          .play()
          .then(function () {
            item.setAttribute("data-v-playing", "true");
          })
          .catch(function (error) {
            console.error("Autoplay failed:", error);
          });
      }
    });

    // Loop functionality - handle video end
    vimeoInstance.on("ended", function () {
      const loopAttribute = item.getAttribute("data-v-loop");

      if (loopAttribute === "true" || loopAttribute === "restart-and-play") {
        // Restart and play again
        vimeoInstance.setCurrentTime(0).then(function () {
          vimeoInstance.play().then(function () {
            item.setAttribute("data-v-playing", "true");
          });
        });
      } else if (loopAttribute === "restart-and-pause") {
        // Restart and pause
        vimeoInstance.setCurrentTime(0).then(function () {
          vimeoInstance.pause().then(function () {
            item.setAttribute("data-v-playing", "false");
          });
        });
      } else {
        // No loop - just update playing state
        item.setAttribute("data-v-playing", "false");
      }
    });

    // NEW FEATURE: Listen for play event to reset timeline-activated
    vimeoInstance.on("play", function () {
      item.setAttribute("data-v-timeline-activated", "false");
    });

    // Update current time dynamically
    let isUserDragging = false;

    vimeoInstance.on("timeupdate", function (data) {
      const currentTimeElement = item.querySelector("[data-v-time='current']");
      if (currentTimeElement) {
        currentTimeElement.textContent = formatTime(data.seconds);
      }

      // Update progress timeline and input (only if not currently being dragged by user)
      const inputElement = item.querySelector("[data-v-tl='input']");
      const progressElement = item.querySelector("[data-v-tl='progress']");
      const percentage = (data.seconds / data.duration) * 100;

      if (progressElement) {
        progressElement.value = percentage;
        progressElement.setAttribute("max", "100");
      }

      // Update input value if user is not actively dragging it
      if (inputElement && !isUserDragging) {
        inputElement.value = percentage;
      }
    });

    // Timeline seek input
    const inputElement = item.querySelector("[data-v-tl='input']");
    if (inputElement) {
      // Set initial attributes
      inputElement.setAttribute("min", "0");
      inputElement.setAttribute("max", "100");
      inputElement.setAttribute("step", "0.01");
      inputElement.value = "0";

      let wasPlaying = false;
      let isDragging = false;

      // Start dragging
      inputElement.addEventListener("mousedown", function () {
        isDragging = true;
        isUserDragging = true;
        wasPlaying = item.getAttribute("data-v-playing") === "true";
        // NEW FEATURE: Set timeline-activated to true on interaction
        item.setAttribute("data-v-timeline-activated", "true");
      });

      inputElement.addEventListener("touchstart", function () {
        isDragging = true;
        isUserDragging = true;
        wasPlaying = item.getAttribute("data-v-playing") === "true";
        // NEW FEATURE: Set timeline-activated to true on interaction
        item.setAttribute("data-v-timeline-activated", "true");
      });

      // During input (dragging or clicking)
      inputElement.addEventListener("input", function (e) {
        e.stopPropagation();
        const percentage = parseFloat(this.value);

        vimeoInstance.getDuration().then(function (duration) {
          const seekTime = (percentage / 100) * duration;
          vimeoInstance.setCurrentTime(seekTime);
        });
      });

      // End dragging
      inputElement.addEventListener("mouseup", function () {
        if (isDragging) {
          const percentage = parseFloat(this.value);

          vimeoInstance.getDuration().then(function (duration) {
            const seekTime = (percentage / 100) * duration;
            vimeoInstance.setCurrentTime(seekTime).then(function () {
              // Always play after seeking is complete
              if (wasPlaying) {
                vimeoInstance.play().then(function () {
                  item.setAttribute("data-v-playing", "true");
                });
              }
            });
          });
        }
        isDragging = false;
        isUserDragging = false;
      });

      inputElement.addEventListener("touchend", function () {
        if (isDragging) {
          const percentage = parseFloat(this.value);

          vimeoInstance.getDuration().then(function (duration) {
            const seekTime = (percentage / 100) * duration;
            vimeoInstance.setCurrentTime(seekTime).then(function () {
              // Always play after seeking is complete
              if (wasPlaying) {
                vimeoInstance.play().then(function () {
                  item.setAttribute("data-v-playing", "true");
                });
              }
            });
          });
        }
        isDragging = false;
        isUserDragging = false;
      });

      // Handle case where user drags outside
      document.addEventListener("mouseup", function () {
        if (isDragging && wasPlaying) {
          vimeoInstance.play().then(function () {
            item.setAttribute("data-v-playing", "true");
          });
        }
        isDragging = false;
        isUserDragging = false;
      });
    }

    // Helper function to format time (seconds to MM:SS or HH:MM:SS)
    function formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      if (hours > 0) {
        return `${hours}:${padZero(minutes)}:${padZero(secs)}`;
      } else {
        return `${minutes}:${padZero(secs)}`;
      }
    }

    function padZero(num) {
      return num.toString().padStart(2, "0");
    }

    // Feature 2: Play/Pause on item click
    item.addEventListener("click", function (e) {
      // Don't trigger if clicking on any control element
      const controlElement = e.target.closest("[data-v-controls]");
      if (controlElement) {
        return;
      }

      const isPlaying = item.getAttribute("data-v-playing") === "true";

      if (isPlaying) {
        vimeoInstance.pause().then(function () {
          item.setAttribute("data-v-playing", "false");
        });
      } else {
        vimeoInstance.play().then(function () {
          item.setAttribute("data-v-playing", "true");
        });
      }
    });

    // Feature 3: Audio control based on data-v-audio attribute
    const audioObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-v-audio"
        ) {
          const audioAttribute = item.getAttribute("data-v-audio");
          if (audioAttribute === "playing") {
            vimeoInstance.setVolume(1).then(function () {
              vimeoInstance.setMuted(false);
            });
          } else if (audioAttribute === "muted") {
            vimeoInstance.setMuted(true);
          }
        }
      });
    });

    // Start observing the item for audio attribute changes
    audioObserver.observe(item, {
      attributes: true,
      attributeFilter: ["data-v-audio"],
    });

    // Feature 4: Play control
    const playControl = item.querySelector("[data-v-controls='play']");
    if (playControl) {
      playControl.addEventListener("click", function (e) {
        e.stopPropagation();
        vimeoInstance.play().then(function () {
          item.setAttribute("data-v-playing", "true");
        });
      });
    }

    // Feature 4: Pause control
    const pauseControl = item.querySelector("[data-v-controls='pause']");
    if (pauseControl) {
      pauseControl.addEventListener("click", function (e) {
        e.stopPropagation();
        vimeoInstance.pause().then(function () {
          item.setAttribute("data-v-playing", "false");
        });
      });
    }

    // Feature 4: Mute control
    const muteControl = item.querySelector("[data-v-controls='mute']");
    if (muteControl) {
      muteControl.addEventListener("click", function (e) {
        e.stopPropagation();
        vimeoInstance.setMuted(true).then(function () {
          item.setAttribute("data-v-audio", "muted");
        });
      });
    }

    // Feature 4: Unmute control
    const unmuteControl = item.querySelector("[data-v-controls='unmute']");
    if (unmuteControl) {
      unmuteControl.addEventListener("click", function (e) {
        e.stopPropagation();
        vimeoInstance.setVolume(1).then(function () {
          vimeoInstance.setMuted(false).then(function () {
            item.setAttribute("data-v-audio", "playing");
          });
        });
      });
    }

    // Feature 4: Fullscreen control
    const fullscreenControl = item.querySelector(
      "[data-v-controls='fullscreen']",
    );

    if (fullscreenControl) {
      fullscreenControl.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent triggering play/pause

        const isFullscreen = item.getAttribute("data-v-fullscreen") === "true";

        if (!isFullscreen) {
          // Enter fullscreen
          if (item.requestFullscreen) {
            item.requestFullscreen();
          } else if (item.webkitRequestFullscreen) {
            item.webkitRequestFullscreen();
          } else if (item.mozRequestFullScreen) {
            item.mozRequestFullScreen();
          } else if (item.msRequestFullscreen) {
            item.msRequestFullscreen();
          }
          item.setAttribute("data-v-fullscreen", "true");
        } else {
          // Exit fullscreen
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          item.setAttribute("data-v-fullscreen", "false");
        }
      });
    }

    // Handle ESC key and fullscreen change events
    document.addEventListener("fullscreenchange", function () {
      if (!document.fullscreenElement) {
        item.setAttribute("data-v-fullscreen", "false");
      }
    });

    document.addEventListener("webkitfullscreenchange", function () {
      if (!document.webkitFullscreenElement) {
        item.setAttribute("data-v-fullscreen", "false");
      }
    });

    document.addEventListener("mozfullscreenchange", function () {
      if (!document.mozFullScreenElement) {
        item.setAttribute("data-v-fullscreen", "false");
      }
    });

    document.addEventListener("msfullscreenchange", function () {
      if (!document.msFullscreenElement) {
        item.setAttribute("data-v-fullscreen", "false");
      }
    });

    // Handle default size videos
    if (sizeAttribute === "default") {
      // Get video dimensions and set aspect ratio
      vimeoInstance.getVideoWidth().then(function (videoWidth) {
        vimeoInstance.getVideoHeight().then(function (videoHeight) {
          const aspectRatio = (videoHeight / videoWidth) * 100;
          // Update padding-top on the height element
          const sizeElement = item.querySelector(".c-vimeo-player-height");
          if (sizeElement) {
            sizeElement.style.paddingTop = aspectRatio + "%";
          }
        });
      });
    }

    // Handle full size videos
    if (sizeAttribute === "full") {
      let aspectRatio;
      // Get video dimensions
      vimeoInstance.getVideoWidth().then(function (videoWidth) {
        vimeoInstance.getVideoHeight().then(function (videoHeight) {
          aspectRatio = videoHeight / videoWidth;
          // Remove padding from height element
          const sizeElement = item.querySelector(".c-vimeo-player-height");
          if (sizeElement) {
            sizeElement.style.paddingTop = "0%";
          }
          // Initial sizing
          resizeVideo();
        });
      });

      // Function to adjust video sizing (to cover the container)
      function resizeVideo() {
        const containerAspect = item.offsetHeight / item.offsetWidth;
        if (iframe && aspectRatio) {
          if (containerAspect > aspectRatio) {
            // Container is taller relative to the video
            const scaleFactor = containerAspect / aspectRatio;
            iframe.style.width = scaleFactor * 100 + "%";
            iframe.style.height = "100%";
          } else {
            // Container is wider relative to the video
            const scaleFactor = aspectRatio / containerAspect;
            iframe.style.height = scaleFactor * 100 + "%";
            iframe.style.width = "100%";
          }
        }
      }

      // Adjust video sizing on window resize
      window.addEventListener("resize", resizeVideo);
    }
  }
});
