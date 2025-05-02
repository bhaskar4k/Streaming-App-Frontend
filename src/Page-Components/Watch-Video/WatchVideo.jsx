import React, { useEffect, useRef, useState } from "react";
import './WatchVideo.css';
import { useSearchParams } from "react-router-dom";
import { StreamingService } from '../../Service/StreamingService';
import like from '../../../public/Images/like.png';
import dislike from '../../../public/Images/dislike.png';
import share from '../../../public/Images/share.svg';
import profile from '../../../public/Images/profile.svg';
import ReactPlayer from 'react-player';

function WatchVideo() {
    const [searchParams] = useSearchParams();

    const guid = searchParams.get("v");
    const playback = searchParams.get("playback") || 0;

    const playerURL = "http://localhost:8092/streaming/video_file/" + guid;
    const [videoBlobUrls, setVideoBlobUrls] = useState([]);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

    const [currentIndex, setCurrentIndex] = useState(0);

    const streamingService = new StreamingService();

    const [isLiked, setIsLiked] = useState(0);
    const [isDisliked, setIsDisliked] = useState(0);
    const [is_processed, set_is_processed] = useState(true);
    const [channel_name, set_channel_name] = useState("");
    const [video_title, set_video_title] = useState("");
    const [video_duration, set_video_duration] = useState(0);
    const [chunk_count, set_chunk_count] = useState(0);
    const [video_resolution, set_video_resolution] = useState([]);
    const [video_description, set_video_description] = useState("");
    const [video_upload_at, set_video_upload_at] = useState("");


    const handleEnded = () => {
        if (currentIndex < videoBlobUrls.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };


    useEffect(() => {
        const fetchVideoInfo = async () => {
            try {
                const response = await streamingService.VideoFileInfo(guid);
                let data = response.data;

                set_channel_name(data.channel);
                set_video_title(data.title);
                set_video_description(data.description);
                set_is_processed(data.properlyProcessed);
                set_video_upload_at(data.trans_datetime);
                set_video_duration(data.videoDuration);
                set_chunk_count(data.chunkCount);
                set_video_resolution(data.videoResolutions);
            } catch (error) {
                console.error("Error fetching video info:", error);
            }
        };

        fetchVideoInfo();
    }, [guid]);

    useEffect(() => {
        fetchAndMergeChunks();
    }, [guid, chunk_count]);


    const fetchAndMergeChunks = async () => {
        if (!guid || chunk_count <= 0) {
            return;
        }

        try {
            // Revoke previous blob URL to avoid memory leaks
            if (videoBlobUrls) {
                URL.revokeObjectURL(videoBlobUrls);
                setVideoBlobUrls([]);
            }

            const blobParts = [];

            // Fetch all chunks in sequence
            for (let i = 1; i <= chunk_count; i++) {
                try {
                    const chunkUrl = `http://localhost:8092/streaming/video_file/${guid}/${i}.mp4`;
                    console.log(`Fetching chunk ${i}/${chunk_count}: ${chunkUrl}`);

                    const response = await fetch(chunkUrl);

                    if (!response.ok) {
                        throw new Error(`Failed to fetch chunk ${i}: ${response.status} ${response.statusText}`);
                    }

                    const blob = await response.blob();
                    blobParts.push(URL.revokeObjectURL(blob));

                } catch (chunkError) {
                    console.error(`Error fetching chunk ${i}:`, chunkError);
                    throw new Error(`Failed to fetch chunk ${i}: ${chunkError.message}`);
                }
            }

            console.log("All chunks fetched, merging...");

            // Merge all blobs into a single video
            // const mergedBlob = new Blob(blobParts, { type: 'video/mp4' });
            // const blobUrl = URL.createObjectURL(mergedBlob);
            setVideoBlobUrls(blobParts);

            console.log("Video successfully merged");

        } catch (error) {
            console.error("Error in fetch and merge process:", error);
        } finally {
        }
    };

    // useEffect(() => {
    //     return () => {
    //         videoBlobUrls.forEach(url => URL.revokeObjectURL(url));
    //     };
    // }, [videoBlobUrls]);

    const handlePlayerEnded = () => {
        if (currentChunkIndex < videoBlobUrls.length - 1) {
            setCurrentChunkIndex(prevIndex => prevIndex + 1);
        }
    };

    useEffect(() => {
        const likeButton = document.getElementById("video_player_info_action_like");
        const dislikeButton = document.getElementById("video_player_info_action_dislike");

        const handleLikeClick = () => {
            if (isLiked === 0) {
                likeButton.style.backgroundColor = "rgb(255, 145, 0)";
                dislikeButton.style.backgroundColor = "rgb(210, 210, 210)";
                setIsLiked(1);
            } else {
                likeButton.style.backgroundColor = "rgb(210, 210, 210)";
                setIsLiked(0);
            }

            setIsDisliked(0);
        };

        const handleDislikeClick = () => {
            if (isDisliked === 0) {
                dislikeButton.style.backgroundColor = "rgb(255, 145, 0)";
                likeButton.style.backgroundColor = "rgb(210, 210, 210)";
                setIsDisliked(1);
            } else {
                dislikeButton.style.backgroundColor = "rgb(210, 210, 210)";
                setIsDisliked(0);
            }

            setIsLiked(0);
        };

        likeButton.addEventListener("click", handleLikeClick);
        dislikeButton.addEventListener("click", handleDislikeClick);

        return () => {
            likeButton.removeEventListener("click", handleLikeClick);
            dislikeButton.removeEventListener("click", handleDislikeClick);
        };
    }, [isLiked, isDisliked]);

    return (
        <>
            <div className="video_player_container">
                <div id="video_player">
                    {!is_processed && <span className="processing_error">Video is not yet processed.</span>}
                    <ReactPlayer
                        url={videoBlobUrls[currentChunkIndex]}
                        controls
                        playing
                        width="100%"
                        height="100%"
                        onEnded={handlePlayerEnded}
                        config={{
                            file: {
                                forceVideo: true,
                                attributes: {
                                    controlsList: 'nodownload',
                                    disablePictureInPicture: true
                                }
                            }
                        }}
                    />
                </div>

                <div className="video_player_info">
                    <div className="video_player_info_header">
                        <span className="video_player_info_title">{video_title}</span>

                        <div className="video_player_info_header_action">
                            <div className="video_player_info_channel_info">
                                <img src={profile}></img>
                                <span className="video_player_info_channel">{channel_name}</span>
                            </div>

                            <div className="video_player_info_action">
                                <div id="video_player_info_action_like">
                                    <img src={like}></img>
                                </div>
                                <div id="video_player_info_action_dislike">
                                    <img src={dislike}></img>
                                </div>
                                <div id="video_player_info_action_share">
                                    <img src={share}></img>
                                </div>
                            </div>
                        </div>
                    </div>

                    <span className="video_player_info_description">
                        {video_upload_at}

                        {video_description !== "" && <div>
                            <br></br>
                            {video_description}
                        </div>}
                    </span>
                </div>
            </div>
        </>
    );
}

export default WatchVideo;
