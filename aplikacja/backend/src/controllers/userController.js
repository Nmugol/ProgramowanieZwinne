const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (User) => {
    return {
        register: async (req, res) => {
            const { username, password, firstName, lastName, email } = req.body;

            if (!username || !password || !firstName || !lastName || !email) {
                return res.status(400).send('All fields are required');
            }

            const existingUser = await User.findOne({ where: { username } });
            const existingEmail = await User.findOne({ where: { email } });

            if (existingUser) return res.status(400).send('Username already exists');
            if (existingEmail) return res.status(400).send('Email already in use');

            const hashedPassword = await bcrypt.hash(password, 10);

            // avatar
            let avatarPath = null;
            if (req.file) {
                const userDir = path.join(__dirname, '..', 'uploads', username);
                fs.mkdirSync(userDir, { recursive: true });

                const extension = path.extname(req.file.originalname);
                const filePath = path.join(userDir, 'avatar' + extension);

                fs.renameSync(req.file.path, filePath);
                avatarPath = `/uploads/${username}/avatar${extension}`;
            }

            await User.create({
                username,
                email,
                firstName,
                lastName,
                password: hashedPassword,
                avatar: avatarPath
            });

            res.send('User registered successfully');
        },

        login: async (req, res) => {
            const { username, password } = req.body;
            if (!username || !password) return res.status(400).send('Username and password required');

            const user = await User.findOne({ where: { username } });
            if (!user) return res.status(400).send('Invalid credentials');

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(400).send('Invalid credentials');

            // Generowanie tokena JWT
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ message: 'Login successful', token });
        },


        updateProfile: async (req, res) => {
            try {
                const { username, email, firstName, lastName } = req.body;
                const user = await User.findByPk(req.user.id);
                if (!user) return res.status(404).send('User not found');

                const oldUsername = user.username;
                let avatarPath = user.avatar;

                // Sprawdź czy username się zmienił
                if (username !== oldUsername) {
                    // Sprawdź czy nowy username nie jest zajęty
                    const existing = await User.findOne({ where: { username } });
                    if (existing) return res.status(400).send('Username already taken');

                    // Przenieś folder awatara, jeśli istnieje
                    const oldDir = path.join(__dirname, '..', 'uploads', oldUsername);
                    const newDir = path.join(__dirname, '..', 'uploads', username);

                    if (fs.existsSync(oldDir)) {
                        // Utwórz nowy folder, jeśli trzeba
                        if (!fs.existsSync(newDir)) {
                            fs.mkdirSync(newDir, { recursive: true });
                        }
                        // Przenieś wszystkie pliki
                        fs.readdirSync(oldDir).forEach(file => {
                            fs.renameSync(path.join(oldDir, file), path.join(newDir, file));
                        });
                        // Usuń stary folder (jeśli pusty)
                        fs.rmdirSync(oldDir);

                        // Aktualizuj ścieżkę avatara jeśli istnieje i zawiera starego username
                        if (avatarPath && avatarPath.includes(`/uploads/${oldUsername}/`)) {
                            avatarPath = avatarPath.replace(`/uploads/${oldUsername}/`, `/uploads/${username}/`);
                        }
                    }
                }

                // Sprawdź czy email się zmienił i czy jest wolny
                if (email !== user.email) {
                    const existingEmail = await User.findOne({ where: { email } });
                    if (existingEmail) return res.status(400).send('Email already used');
                }

                // Obsługa awatara - jeśli plik został przesłany
                if (req.file) {
                    // Folder dla usera (po zmianie username)
                    const userDir = path.join(__dirname, '..', 'uploads', username);

                    if (!fs.existsSync(userDir)) {
                        fs.mkdirSync(userDir, { recursive: true });
                    }

                    // Usuń stary avatar, jeśli istnieje
                    if (avatarPath) {
                        const oldAvatarAbsolute = path.join(__dirname, '..', avatarPath);
                        if (fs.existsSync(oldAvatarAbsolute)) {
                            fs.unlinkSync(oldAvatarAbsolute);
                        }
                    }

                    // Zapisz nowy avatar pod nazwą avatar + rozszerzenie
                    const extension = path.extname(req.file.originalname);
                    const filePath = path.join(userDir, 'avatar' + extension);
                    fs.renameSync(req.file.path, filePath);

                    avatarPath = `/uploads/${username}/avatar${extension}`;
                }

                // Aktualizuj usera
                user.username = username;
                user.email = email;
                user.firstName = firstName;
                user.lastName = lastName;
                user.avatar = avatarPath;

                await user.save();

                res.send('User updated successfully');

            } catch (err) {
                console.error(err);
                res.status(500).send('Internal server error');
            }
        },


        changePassword: async (req, res) => {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findByPk(req.user.id);

            if (!user) return res.status(404).send('User not found');

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).send('Incorrect current password');

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            res.send('Password updated successfully');
        }

    };
};


