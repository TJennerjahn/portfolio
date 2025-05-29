import React from 'react';
import { Mail, Phone, Globe, Github } from 'lucide-react';

const SkillBar = ({ level, maxLevel = 5 }) => {
    return (
        <div className="flex gap-1">
            {[...Array(maxLevel)].map((_, i) => (
                <div
                    key={i}
                    className={`w-3 h-3 rounded border border-orange-400 ${i < level
                        ? 'bg-orange-500'
                        : 'bg-white dark:bg-black'
                        }`}
                />
            ))}
        </div>
    );
};

const CV = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 pb-6 border-b-2 border-orange-500">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-light mb-2">
                        Tobias <span className="font-normal">Jennerjahn</span>
                    </h1>
                    <p className="text-lg italic">Resume</p>
                </div>
            </div>

            {/* Professional Experience */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-orange-500">
                    Professional Experience
                </h2>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:gap-6">
                        <div className="w-full sm:w-32 flex-shrink-0 text-sm font-medium mb-2 sm:mb-0">
                            Since 2025
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">Founder & Developer - Increader.com</h3>
                            <p className="italic mb-2">Solo Venture</p>
                            <div className="text-sm">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Designed and built a productivity app for incremental reading and spaced repetition.</li>
                                    <li>Implemented a custom reading mode, global annotations across document types and AI summaries.</li>
                                    <li>Continuously iterating based on personal use and aiming to contribute to open-source communities.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                    <div className="flex flex-col sm:flex-row sm:gap-6">
                        <div className="w-full sm:w-32 flex-shrink-0 text-sm font-medium mb-2 sm:mb-0">
                            Oct. 2022 – Feb. 2023
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">Tutor for "Software Engineering"</h3>
                            <p className="italic mb-2">University of Leipzig, Leipzig</p>
                            <p className="text-sm mb-2">
                                Supervision of a semester-long group project within the course framework.
                            </p>
                            <div className="text-sm">
                                <p className="font-medium mb-1">Key Focus Areas:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Teaching modern web development methodologies</li>
                                    <li>Introduction to Git, CI/CD pipelines, Docker</li>
                                    <li>Supervising planning, development and deployment of web applications</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                    <div className="flex flex-col sm:flex-row sm:gap-6">
                        <div className="w-full sm:w-32 flex-shrink-0 text-sm font-medium mb-2 sm:mb-0">
                            Sept. 2021 – May 2022
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">Fullstack Web Developer (Freelance)</h3>
                            <p className="italic mb-2">Self-employed, remote</p>
                            <p className="text-sm mb-2">
                                Independent development of complex web applications.
                            </p>
                            <div className="text-sm">
                                <p className="font-medium mb-1">Highlights:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Built a financial platform with invoicing, payment processing, referral program, admin functions</li>
                                    <li>Technology stack: Svelte (incl. component library), GraphQL, NestJS with TypeScript, MongoDB</li>
                                    <li>Focus on rapid iteration while maintaining maintainability</li>
                                    <li>On-premise deployment and system integration</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                    <div className="flex flex-col sm:flex-row sm:gap-6">
                        <div className="w-full sm:w-32 flex-shrink-0 text-sm font-medium mb-2 sm:mb-0">
                            Oct. 2015 – Aug. 2016
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">Federal Volunteer Service (BFD)</h3>
                            <p className="italic mb-2">DLRG, Nationwide</p>
                            <p className="text-sm mb-2">
                                Support in organizing and implementing relief measures during the migration crisis.
                            </p>
                            <div className="text-sm">
                                <p className="font-medium mb-1">Additional Responsibilities:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Administrative tasks in daily operations</li>
                                    <li>Development of an automated feedback evaluation tool with OCR and computer vision</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Education */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-orange-500">
                    Education
                </h2>
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:gap-6">
                        <div className="w-full sm:w-32 flex-shrink-0 text-sm font-medium mb-2 sm:mb-0">
                            2021–2025
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">B.Sc. Computer Science</h3>
                            <p className="italic">University of Leipzig</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-6">
                        <div className="w-full sm:w-32 flex-shrink-0 text-sm font-medium mb-2 sm:mb-0">
                            until 2015
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">Abitur / General Higher Education Entrance Qualification</h3>
                            <p className="italic">European School Gymnasium Bad Nenndorf</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-orange-500">
                    Additional
                </h2>
                <div className="flex flex-col sm:flex-row sm:gap-6">
                    <div className="w-full sm:w-32 flex-shrink-0 text-sm font-medium mb-2 sm:mb-0">
                        Sept. 2023
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold">Swiss AI Safety Camp</h3>
                        <p className="text-sm">
                            Two-week continuing education program on technical, societal and safety-relevant aspects of modern AI systems
                        </p>
                    </div>
                </div>
            </section>

            {/* Technical Skills */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-orange-500">
                    Technical Skills
                </h2>

                <div className="space-y-4">
                    {/* Languages */}
                    <div>
                        <h3 className="font-semibold mb-2">Languages:</h3>
                        <div className="space-y-3 sm:space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={4} />
                                    <span className="w-20 sm:w-24">TypeScript</span>
                                    <span className="w-8">3 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Freelance projects & web applications</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={3} />
                                    <span className="w-20 sm:w-24">Python</span>
                                    <span className="w-8">2 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">ML projects & tool development</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={3} />
                                    <span className="w-20 sm:w-24">Java</span>
                                    <span className="w-8">2 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">University projects & Spring applications</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={2} />
                                    <span className="w-20 sm:w-24">C#</span>
                                    <span className="w-8">1 yr</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Basic knowledge and first projects</span>
                            </div>
                        </div>
                    </div>

                    {/* Frameworks */}
                    <div>
                        <h3 className="font-semibold mb-2">Frameworks:</h3>
                        <div className="space-y-3 sm:space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={4} />
                                    <span className="w-20 sm:w-24">Svelte</span>
                                    <span className="w-8">3 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Freelance & rapid prototyping</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={3} />
                                    <span className="w-20 sm:w-24">React</span>
                                    <span className="w-8">2 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Client projects & frontend development</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={2} />
                                    <span className="w-20 sm:w-24">Spring</span>
                                    <span className="w-8">1 yr</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">University group projects</span>
                            </div>
                        </div>
                    </div>

                    {/* Databases */}
                    <div>
                        <h3 className="font-semibold mb-2">API & Databases:</h3>
                        <div className="space-y-3 sm:space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={4} />
                                    <span className="w-20 sm:w-24">PostgreSQL</span>
                                    <span className="w-8">3 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Freelance & web applications</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={3} />
                                    <span className="w-20 sm:w-24">MongoDB</span>
                                    <span className="w-8">2 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Flexible data structures</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={3} />
                                    <span className="w-20 sm:w-24">GraphQL</span>
                                    <span className="w-8">3 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">API design & integration</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={4} />
                                    <span className="w-20 sm:w-24">REST</span>
                                    <span className="w-8">4 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Fullstack projects</span>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure */}
                    <div>
                        <h3 className="font-semibold mb-2">Infrastructure:</h3>
                        <div className="space-y-3 sm:space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={5} />
                                    <span className="w-20 sm:w-24">Git</span>
                                    <span className="w-8">6 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Daily workflow</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={4} />
                                    <span className="w-20 sm:w-24">Linux</span>
                                    <span className="w-8">5 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Dev environment & server admin</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={3} />
                                    <span className="w-20 sm:w-24">Docker</span>
                                    <span className="w-8">3 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Service containerization</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={2} />
                                    <span className="w-20 sm:w-24">Kubernetes</span>
                                    <span className="w-8">1 yr</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Test deployments</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={2} />
                                    <span className="w-20 sm:w-24">Azure</span>
                                    <span className="w-8">1 yr</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">University context</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <SkillBar level={3} />
                                    <span className="w-20 sm:w-24">Vercel</span>
                                    <span className="w-8">2 yrs</span>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-0 sm:ml-0">Client deployments</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Languages */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-orange-500">
                    Languages
                </h2>
                <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="font-medium">German</span>
                        <span className="">Native speaker</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="font-medium">English</span>
                        <span className="">Fluent in speaking and writing</span>
                    </div>
                </div>
            </section>

            {/* Interests */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-orange-500">
                    Interests
                </h2>
                <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold">Homelab</h3>
                        <p className="text-sm">
                            Self-hosted services and infrastructure for testing tools, deployment setups, and smart home automations
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold">AI Safety & Effective Altruism</h3>
                        <p className="text-sm">
                            Exploring the long-term impacts of advanced AI systems and engaging with the effective altruism community through events and self-study
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Ergonomic Keyboards</h3>
                        <p className="text-sm">
                            Designing and building custom split keyboards – from circuit design to case construction
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CV;
