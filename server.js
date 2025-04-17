require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'travelConnectDB',
    port: process.env.DB_PORT || 3306
});

// Attempt connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL database.');

    // Check if rating column exists and add it if it doesn't
    const checkColumnSQL = `
        SELECT COUNT(*) as count 
        FROM information_schema.columns 
        WHERE table_schema = DATABASE() 
        AND table_name = 'explore_posts' 
        AND column_name = 'rating'
    `;

    db.query(checkColumnSQL, (err, results) => {
        if (err) {
            console.error('Error checking for rating column:', err);
            return;
        }

        if (results[0].count === 0) {
            // Column doesn't exist, add it
            const addColumnSQL = `
                ALTER TABLE explore_posts 
                ADD COLUMN rating INT DEFAULT 0
            `;

            db.query(addColumnSQL, (err) => {
                if (err) {
                    console.error('Error adding rating column:', err);
                    return;
                }
                console.log('Rating column added to explore_posts table');

                // Set initial rating to 0 for all existing posts
                const updateRatingSQL = `
                    UPDATE explore_posts 
                    SET rating = 0 
                    WHERE rating IS NULL
                `;

                db.query(updateRatingSQL, (err) => {
                    if (err) {
                        console.error('Error setting initial ratings:', err);
                        return;
                    }
                    console.log('Initial ratings set to 0 for all existing posts');
                });
            });
        } else {
            console.log('Rating column already exists in explore_posts table');
        }

        // Create post_votes table if it doesn't exist
        const createPostVotesTableSQL = `
            CREATE TABLE IF NOT EXISTS post_votes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                user_id INT NOT NULL,
                vote_type ENUM('up', 'down') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES explore_posts(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_vote (post_id, user_id)
            )
        `;

        db.query(createPostVotesTableSQL, (err) => {
            if (err) {
                console.error('Error creating post_votes table:', err);
                return;
            }
            console.log('Post votes table created or already exists');
        });
    });
});

// ==============================
// Register Endpoint
// ==============================
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
          console.error("❌ Database Insert Error:", err);
          return res.status(500).json({ error: err.message || 'Failed to register user.' });
        }
  
        console.log('✅ User inserted with ID:', result.insertId);
        res.status(201).json({
          message: 'User registered successfully.',
          email,
          id: result.insertId, // ✅ Include user ID in response
        });
      });
    } catch (error) {
      console.error("❌ Bcrypt Error:", error);
      res.status(500).json({ error: 'Something went wrong during registration.' });
    }
  });
  
  


// ==============================
// Login Endpoint
// ==============================
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Login failed' });

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('✅ test:', user);
        // Return email so frontend can save it for later
        res.json({ message: 'Login successful', token, email, id: user.id });
    });
});


// ==============================
// Protected Route (For Testing)
// ==============================
app.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to your profile!' });
});

// ==============================
// Token Authentication Middleware
// ==============================
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader);
    
    if (!authHeader) {
        console.error('No authorization header found');
        return res.status(401).json({ error: 'No authorization header found' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    if (!token) {
        console.error('No token found in authorization header');
        return res.status(401).json({ error: 'No token found in authorization header' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(403).json({ error: 'Invalid token' });
        }
        console.log('Token verified successfully. User:', user);
        req.user = user;
        next();
    });
}

// ==============================
// Add Post Endpoint
// ==============================
app.post('/addQuestion', (req, res) => {
    const { user_id, title, description, priority } = req.body;

    if (!user_id || !title || !description) {
        return res.status(400).json({ error: 'User ID, title, and description are required.' });
    }

    // Log incoming data for debugging
    console.log('📥 Incoming Question Data:', { user_id, title, description, priority });

    const insertPostSQL = `
        INSERT INTO posts (title, description, user_id, priority)
        VALUES (?, ?, ?, ?)
    `;

    // Ensure priority is saved as a string
    const priorityValue = priority === true ? "High" : priority;

    db.query(insertPostSQL, [title, description, user_id, priorityValue], (err, result) => {
        if (err) {
            console.error('❌ Database Error:', err);
            return res.status(500).json({ 
                error: 'Failed to save post.',
                details: err.message 
            });
        }

        console.log('✅ Post saved successfully with priority:', priorityValue);
        res.status(201).json({ 
            message: 'Post added successfully!', 
            postId: result.insertId,
            priority: priorityValue
        });
    });
});


app.post('/addPost', (req, res) => {
    const { user_id, title, description, priority } = req.body;

    if (!user_id || !title || !description) {
        return res.status(400).json({ error: 'User ID, title, and description are required.' });
    }

    // Handle priority as a string value
    const priorityValue = priority === true || priority === 1 ? "High" : priority;

    // Log incoming data for debugging
    console.log('📥 Incoming Post Data:', { user_id, title, description, priority, priorityValue });

    const insertPostSQL = `
        INSERT INTO posts (title, description, user_id, priority)
        VALUES (?, ?, ?, ?)
    `;

    db.query(insertPostSQL, [title, description, user_id, priorityValue], (err, result) => {
        if (err) {
            console.error('❌ Database Error:', err);
            return res.status(500).json({ 
                error: 'Failed to save post.',
                details: err.message 
            });
        }

        console.log('✅ Post saved successfully with priority:', priorityValue);
        res.status(201).json({ 
            message: 'Post added successfully!', 
            postId: result.insertId,
            priority: priorityValue
        });
    });
});



app.get('/getPosts', (req, res) => {
    const sql = `
        SELECT p.id, p.title, p.description, u.name, u.profile_image, u.country
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching posts:", err);
            return res.status(500).json({ error: "Failed to fetch posts." });
        }
        console.log("✅ Posts fetched:", results);
        res.json(results);
    });
});

app.get('/getQuestions', (req, res) => {
    const sql = `
      SELECT p.id, p.title, p.description, p.priority, u.name, u.profile_image, u.country
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Error fetching questions:", err);
        return res.status(500).json({ error: "Failed to fetch questions." });
      }
  
      console.log("✅ Questions fetched with priority:", JSON.stringify(results, null, 2));
      res.json(results);
    });
  });
  


// Endpoint to Save User Data
app.post('/saveUserData', (req, res) => {
    const { email, country, language, name, gender, profileImage } = req.body;

    console.log('📥 Incoming Data:', req.body);

    if (!email || !country || !language || !name || !gender || !profileImage) {
        console.error('❌ Missing fields:', { email, country, language, name, gender, profileImage });
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `
        UPDATE users 
        SET country = ?, 
            language = ?, 
            name = ?, 
            gender = ?, 
            profile_image = ?
        WHERE email = ?;
    `;

    db.query(sql, [
        country,
        language,
        name,
        gender,
        decodeURIComponent(profileImage),
        email
    ], (err, result) => {
        if (err) {
            console.error('❌ Database Error:', err.message);
            return res.status(500).json({ error: 'Failed to save profile data' });
        }

        console.log('✅ Data saved successfully:', result);
        res.status(200).json({ message: 'Profile data saved successfully' });
    });
});

// Add Comment Endpoint
app.post('/addComment', authenticateToken, (req, res) => {
    console.log('Received comment request:', {
        user: req.user,
        body: req.body
    });

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
        console.error('Authentication error: No user ID found in token');
        return res.status(401).json({ error: 'Authentication failed. Please login again.' });
    }

    const { post_id, text } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!post_id || !text) {
        console.error('Missing required fields:', { post_id, text });
        return res.status(400).json({ error: 'Post ID and comment text are required.' });
    }

    console.log('Adding comment with data:', { post_id, user_id, text });

    const sql = `
        INSERT INTO comments (post_id, user_id, text)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [post_id, user_id, text], (err, result) => {
        if (err) {
            console.error('❌ Database Error:', err);
            return res.status(500).json({ error: 'Failed to save comment.' });
        }

        // Get the comment with user details
        const getCommentSQL = `
            SELECT c.*, u.name, u.profile_image, u.country
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `;

        db.query(getCommentSQL, [result.insertId], (err, results) => {
            if (err) {
                console.error('❌ Error fetching comment:', err);
                return res.status(500).json({ error: 'Failed to fetch comment details.' });
            }

            if (!results || results.length === 0) {
                console.error('❌ No comment found after insertion');
                return res.status(500).json({ error: 'Failed to retrieve saved comment.' });
            }

            console.log('✅ Comment saved successfully:', results[0]);
            res.status(201).json(results[0]);
        });
    });
});

// Get Comments Endpoint
app.get('/getComments/:postId', (req, res) => {
    const { postId } = req.params;

    const sql = `
        SELECT c.*, u.name, u.profile_image, u.country
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at DESC
    `;

    db.query(sql, [postId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching comments:', err);
            return res.status(500).json({ error: 'Failed to fetch comments.' });
        }

        console.log('✅ Comments fetched successfully:', results);
        res.json(results);
    });
});

// Add Post with Images Endpoint
app.post('/addImagesPost', (req, res) => {
    const { title, description, images, priority } = req.body;
    const user_id = req.user.id; // Get user_id from the authenticated token

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required.' });
    }

    // Log incoming data for debugging
    console.log('📥 Incoming Post Data:', { user_id, title, description, images, priority });

    const insertPostSQL = `
        INSERT INTO posts (title, description, user_id, priority, images)
        VALUES (?, ?, ?, ?, ?)
    `;

    // Convert images array to JSON string for storage
    const imagesJson = JSON.stringify(images || []);

    db.query(insertPostSQL, [title, description, user_id, priority, imagesJson], (err, result) => {
        if (err) {
            console.error('❌ Database Error:', err);
            return res.status(500).json({ 
                error: 'Failed to save post.',
                details: err.message 
            });
        }

        console.log('✅ Post saved successfully with images');
        res.status(201).json({ 
            message: 'Post added successfully!', 
            postId: result.insertId
        });
    });
});

// Add explore post with images
app.post('/addExplorePost', authenticateToken, async (req, res) => {
  const { title, description, images } = req.body;
  const user_id = req.user.id; // Get user_id from the authenticated token

  console.log("Received explore post data:", { title, description, images, user_id });

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    // Convert images array to JSON string for storage
    const imagesJson = JSON.stringify(images || []);

    const query = `
      INSERT INTO explore_posts (user_id, title, description, images)
      VALUES (?, ?, ?, ?)
    `;

    db.query(query, [user_id, title, description, imagesJson], (error, results) => {
      if (error) {
        console.error('Error saving explore post:', error);
        return res.status(500).json({ error: 'Failed to save post' });
      }

      console.log('Explore post saved successfully:', results);
      res.json({ 
        message: 'Post saved successfully',
        postId: results.insertId
      });
    });
  } catch (error) {
    console.error('Error in addExplorePost:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add endpoint to get explore posts
app.get('/getExplorePosts', async (req, res) => {
  try {
    const query = `
      SELECT 
        ep.id,
        ep.title,
        ep.description,
        ep.images,
        ep.created_at,
        u.id as user_id,
        u.name as user,
        u.profile_image,
        u.country,
        u.language
      FROM explore_posts ep
      JOIN users u ON ep.user_id = u.id
      ORDER BY ep.created_at DESC
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching explore posts:', error);
        return res.status(500).json({ error: 'Failed to fetch posts' });
      }

      // Log raw results
      console.log('Raw database results:', results[0]);

      // Transform the results to handle file paths
      const postsWithParsedImages = results.map(post => {
        console.log('Processing post:', post.id);
        console.log('Raw images field:', post.images);
        
        let parsedImages = [];
        if (post.images) {
          try {
            // If it's already an array, use it directly
            if (Array.isArray(post.images)) {
              parsedImages = post.images;
            } else {
              // Try to parse JSON string
              parsedImages = JSON.parse(post.images);
            }
            console.log('Parsed images:', parsedImages);
          } catch (e) {
            console.error('Error parsing images for post', post.id, ':', e);
            // If parsing fails, try to handle it as a single image path
            if (typeof post.images === 'string') {
              parsedImages = [post.images];
            }
          }
        }

        // Ensure all paths are valid
        const formattedImages = parsedImages
          .filter(img => img) // Remove null/empty values
          .map(img => {
            // Handle file paths
            if (typeof img === 'string') {
              return img.startsWith('/var/mobile/Containers/') ? `file://${img}` : img;
            }
            return null;
          })
          .filter(img => img); // Remove any null values after processing

        console.log('Formatted images:', formattedImages);

        return {
          ...post,
          images: formattedImages
        };
      });

      console.log('First processed post:', postsWithParsedImages[0]);
      res.json(postsWithParsedImages);
    });
  } catch (error) {
    console.error('Error in getExplorePosts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vote on a post
app.post('/votePost', authenticateToken, async (req, res) => {
    const { post_id, vote_type } = req.body;
    const user_id = req.user.id;

    console.log('Vote request received:', { post_id, vote_type, user_id });

    if (!post_id || !vote_type) {
        console.error('Missing required fields:', { post_id, vote_type });
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // First check if the post exists in explore_posts table
        const [postCheck] = await db.promise().query(
            'SELECT id FROM explore_posts WHERE id = ?',
            [post_id]
        );

        if (postCheck.length === 0) {
            console.error('Post not found in explore_posts:', post_id);
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user has already voted on this post
        const [existingVote] = await db.promise().query(
            'SELECT * FROM post_votes WHERE post_id = ? AND user_id = ?',
            [post_id, user_id]
        );

        console.log('Existing vote check:', existingVote);

        if (existingVote.length > 0) {
            // Update existing vote
            const [result] = await db.promise().query(
                'UPDATE post_votes SET vote_type = ? WHERE post_id = ? AND user_id = ?',
                [vote_type, post_id, user_id]
            );
            console.log('Updated existing vote:', result);
        } else {
            // Insert new vote
            const [result] = await db.promise().query(
                'INSERT INTO post_votes (post_id, user_id, vote_type) VALUES (?, ?, ?)',
                [post_id, user_id, vote_type]
            );
            console.log('Inserted new vote:', result);
        }

        // Calculate new rating
        const [votes] = await db.promise().query(
            'SELECT vote_type FROM post_votes WHERE post_id = ?',
            [post_id]
        );

        console.log('All votes for post:', votes);

        const upvotes = votes.filter(v => v.vote_type === 'up').length;
        const totalVotes = votes.length;
        const newRating = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 0;

        console.log('Calculated new rating:', { upvotes, totalVotes, newRating });

        // Update explore post rating in real-time
        const [updateResult] = await db.promise().query(
            'UPDATE explore_posts SET rating = ? WHERE id = ?',
            [newRating, post_id]
        );

        console.log('Updated post rating:', updateResult);

        // Return the new rating to update the UI
        res.json({ 
            success: true, 
            newRating,
            message: 'Vote processed successfully'
        });
    } catch (error) {
        console.error('Detailed voting error:', {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage,
            sqlState: error.sqlState
        });
        res.status(500).json({ 
            error: 'Failed to process vote',
            details: error.message 
        });
    }
});

// Get User Profile Endpoint
app.get('/getUserProfile', async (req, res) => {
  const { email } = req.query;

  console.log('Received profile request for email:', email);

  if (!email) {
    console.log('No email provided in request');
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const sql = `
      SELECT id, name, email, country, language, gender, profile_image, created_at
      FROM users
      WHERE email = ?
    `;

    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch user profile', details: err.message });
      }

      if (results.length === 0) {
        console.log('No user found for email:', email);
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = results[0];
      console.log('Found user data:', { ...userData, password: '[REDACTED]' });

      // Clean up the response data
      delete userData.password;
      
      res.json(userData);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
